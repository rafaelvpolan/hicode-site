import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const rootDir = fileURLToPath(new URL('..', import.meta.url))
const isoSource = readFileSync(`${rootDir}/src/components/IsoBlock.vue`, 'utf-8')

function ruleBody(selector: string): string {
  const match = isoSource.match(new RegExp(`\\${selector} \\{([^}]*)\\}`))
  if (match === null) {
    throw new Error(`regra ${selector} não encontrada em IsoBlock.vue`)
  }
  return match[1]
}

const cap = ruleBody('.iso-cap')
const rig = ruleBody('.iso-rig')
const top = ruleBody('.iso-top')
const iso = ruleBody('.iso')

describe('o conteúdo do IsoBlock repousa sobre a face superior da laje', () => {
  it('.iso-cap — no repouso — não sobe mais meia profundidade arbitrária', () => {
    expect(cap).not.toContain('var(--iso-depth) * .5')
    expect(cap).not.toContain('var(--iso-depth) * 0.5')
  })

  it('.iso-cap — no repouso — usa o assento declarado, não um número solto', () => {
    expect(cap).toContain('var(--iso-seat)')
  })

  it('.iso — declara o assento — a partir da mesma profundidade da face de cima', () => {
    expect(iso).toMatch(/--iso-seat:\s*calc\([^;]*var\(--iso-depth\) \* 2/)
  })

  it('.iso — declara o assento — projetando a profundidade pela inclinação da plataforma', () => {
    expect(iso).toMatch(/--iso-seat:[^;]*sin\(var\(--iso-tilt\)\)/)
  })

  it('.iso-top — a face de cima — continua a dois níveis de profundidade', () => {
    expect(top).toContain('translateZ(calc(var(--iso-depth) * 2))')
  })
})

describe('no hover a laje e o conteúdo sobem juntos', () => {
  const lift = 'var(--iso-hover, 0) * var(--iso-lift)'

  it('.iso-rig — no hover — sobe o empilhamento', () => {
    expect(rig).toContain(lift)
  })

  it('.iso-cap — no hover — sobe exatamente o mesmo tanto', () => {
    expect(cap).toContain(lift)
  })
})

describe('o ícone acende o próprio gatilho, sem depender do card ao redor', () => {
  const hover = isoSource.match(/(^|[\s,}])\.iso:hover\s*\{([^}]*)\}/m)

  it('IsoBlock.vue — declara .iso:hover, com o seletor começando no próprio .iso', () => {
    expect(hover).not.toBeNull()
  })

  it('.iso — sob o mouse — acende --iso-hover sem esperar por um ancestral', () => {
    expect(hover?.[2]).toMatch(/--iso-hover:\s*1/)
  })

  it('IsoBlock — decorativo e aria-hidden — não virou focável para ganhar o hover', () => {
    expect(isoSource).not.toContain('tabindex')
  })
})

describe('o que é animado tem saída para prefers-reduced-motion', () => {
  const reduced = isoSource.match(/@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*?)\n\}/)

  it('IsoBlock.vue — declara o bloco de movimento reduzido', () => {
    expect(reduced).not.toBeNull()
  })

  it.each([['.iso-rig'], ['.iso-cap'], ['.iso-glow']])(
    'IsoBlock.vue — movimento reduzido — cobre %s',
    (selector) => {
      expect(reduced?.[1]).toContain(selector)
    },
  )
})
