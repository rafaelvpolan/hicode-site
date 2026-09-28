import { describe, expect, it } from 'vitest'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import StrokeIcon from './components/StrokeIcon.vue'
import { phaseIconKeys, strokeIconKeys, type StrokeIconKey } from './strokeIcons'

type IconProps = { icon: StrokeIconKey }

function mountIcon(icon: string): Promise<string> {
  return renderToString(createSSRApp(StrokeIcon, { icon } as IconProps))
}

function mountIconWithoutProp(): Promise<string> {
  return renderToString(createSSRApp(StrokeIcon, {} as IconProps))
}

function drawnShapeCount(svg: string): number {
  return [...svg.matchAll(/<(path|rect|line|circle|polygon)\b/g)].length
}

function drawings(svg: string): string[] {
  return [...svg.matchAll(/\bd="([^"]+)"/g)].map((match) => match[1])
}

function signatureOf(svg: string): string {
  const [first] = drawings(svg)
  if (first === undefined) throw new Error('o ramo renderizado não tem nenhum traço')
  return first
}

const mountedByKey = new Map<string, string>(
  await Promise.all(strokeIconKeys.map(async (key) => [key, await mountIcon(key)] as const)),
)

function mountedOf(key: string): string {
  const markup = mountedByKey.get(key)
  if (markup === undefined) throw new Error(`a chave ${key} não foi montada`)
  return markup
}

const KEY_OUTSIDE_THE_ALPHABET = 'quimera'
const fallbackMarkup = await mountIcon(KEY_OUTSIDE_THE_ALPHABET)

function otherKeysOf(key: string): readonly StrokeIconKey[] {
  return strokeIconKeys.filter((other) => other !== key)
}

describe('StrokeIcon montado desenha o ramo da chave pedida', () => {
  it.each([...phaseIconKeys])('fase %s — desenha forma, não um SVG vazio', (key) => {
    expect(drawnShapeCount(mountedOf(key))).toBeGreaterThan(0)
  })

  it.each([...phaseIconKeys])('fase %s — corre o traço por --iso-hover', (key) => {
    expect(mountedOf(key)).toContain('stroke-icon-flow')
  })

  it.each([...phaseIconKeys])('fase %s — não desenha o ramo de nenhuma outra chave', (key) => {
    const mine = mountedOf(key)
    for (const other of otherKeysOf(key)) {
      expect(mine).not.toContain(signatureOf(mountedOf(other)))
    }
    expect(mine).not.toContain(signatureOf(fallbackMarkup))
  })

  it('as seis fases — têm desenhos distintos entre si', () => {
    const signatures = phaseIconKeys.map((key) => signatureOf(mountedOf(key)))
    expect(new Set(signatures).size).toBe(phaseIconKeys.length)
  })

  it.each([...phaseIconKeys])('fase %s — sai decorativa e inerte para o leitor de tela', (key) => {
    const mine = mountedOf(key)
    expect(mine).toContain('aria-hidden="true"')
    expect(mine).toContain('focusable="false"')
    // o renderizador SSR normaliza nome de atributo para minusculo, entao aqui sai
    // `viewbox`. O site e SPA e nao tem SSR: o browser recebe o `viewBox` do SFC,
    // que o teste de fonte ja trava. O que importa provar aqui e a caixa 32x32.
    expect(mine).toMatch(/viewbox="0 0 32 32"/i)
  })
})

describe('StrokeIcon montado com entrada fora do alfabeto', () => {
  const invalidInputs: Array<[string, string]> = [
    ['chave inexistente', KEY_OUTSIDE_THE_ALPHABET],
    ['string vazia', ''],
    ['chave em caixa alta', 'RUN'],
    ['chave com espaço sobrando', 'run '],
  ]

  it.each(invalidInputs)('%s — desenha a cruz visível, não um SVG vazio', async (_label, input) => {
    const markup = await mountIcon(input)
    expect(drawnShapeCount(markup)).toBeGreaterThan(0)
    expect(markup).toBe(fallbackMarkup)
  })

  it('prop ausente — cai no mesmo desenho visível da chave desconhecida', async () => {
    const markup = await mountIconWithoutProp()
    expect(drawnShapeCount(markup)).toBeGreaterThan(0)
    expect(markup).toBe(fallbackMarkup)
  })

  it('chave desconhecida — não empresta o desenho de nenhuma chave do alfabeto', () => {
    for (const key of strokeIconKeys) {
      expect(fallbackMarkup).not.toContain(signatureOf(mountedOf(key)))
    }
  })
})

describe('o alfabeto declarado e o componente montado não divergem', () => {
  it.each([...strokeIconKeys])('chave %s — tem ramo próprio, não cai no v-else', (key) => {
    expect(mountedOf(key)).not.toBe(fallbackMarkup)
  })

  it('o alfabeto inteiro — não repete desenho entre chaves', () => {
    const signatures = strokeIconKeys.map((key) => signatureOf(mountedOf(key)))
    expect(new Set(signatures).size).toBe(strokeIconKeys.length)
  })
})
