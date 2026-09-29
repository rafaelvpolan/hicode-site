import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const rootDir = fileURLToPath(new URL('..', import.meta.url))
const isoSource = readFileSync(`${rootDir}/src/components/IsoBlock.vue`, 'utf-8')
const styleSource = readFileSync(`${rootDir}/src/style.css`, 'utf-8')
const strokeSource = readFileSync(`${rootDir}/src/components/StrokeIcon.vue`, 'utf-8')

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

describe('no hover a plataforma fica parada e só o ícone sobe — é a separação que dá o encaixe', () => {
  it('.iso-rig — a plataforma — não tem termo nenhum preso a --iso-hover: nem giro, nem subida, nem escala', () => {
    expect(rig).not.toContain('--iso-hover')
  })

  // apagar demais passaria no caso acima: sem o giro estático o losango vira quadrado de frente
  it('.iso-rig — segue com a projeção isométrica estática, que não é animação', () => {
    expect(rig).toContain('rotateX(var(--iso-tilt))')
    expect(rig).toContain('rotateZ(var(--iso-spin))')
  })

  it('.iso-cap — no repouso — assenta na face de cima da plataforma', () => {
    expect(cap).toContain('var(--iso-seat)')
  })

  it('.iso-cap — no hover — sobe pelo degrau, e é o único que sobe', () => {
    expect(cap).toContain('var(--iso-lift)')
    expect(cap).toContain('var(--iso-hover, 0)')
  })

  // "sobe um degrau e PARA": intensidade acima de 1 acende o halo, não levanta mais o ícone
  it('.iso-cap — a subida — é limitada a um degrau por min()', () => {
    expect(cap).toMatch(/min\(var\(--iso-hover, 0\), 1\)\s*\*\s*var\(--iso-lift\)/)
  })
})

describe('o degrau tem a medida de uma laje, e é medido onde o tamanho já se conhece', () => {
  it('--iso-lift — é uma laje projetada pela inclinação, não um número solto', () => {
    expect(iso).toMatch(/--iso-lift:\s*calc\(var\(--iso-depth\) \* sin\(var\(--iso-tilt\)\)\)/)
  })

  // var() dentro de custom property resolve onde ela é DECLARADA: no :root o --iso-depth seria
  // sempre o do tamanho médio, e o ícone grande subiria o degrau do pequeno
  it('--iso-lift — não vive no :root, senão todo tamanho herdaria o degrau do médio', () => {
    expect(styleSource).not.toContain('--iso-lift')
  })
})

describe('o traço corrente depende de um token que precisa existir', () => {
  it('StrokeIcon — o traço corre por --iso-flow, e não por um número solto', () => {
    expect(strokeSource).toMatch(/stroke-dashoffset:\s*calc\(var\(--iso-hover, 0\) \* var\(--iso-flow\)\)/)
  })

  // sem a declaração o calc() fica inválido e o traço para de correr sem erro nenhum:
  // é o tipo de falha que nenhum build acusa e nenhum olho nota de imediato
  it('--iso-flow — é declarado em style.css, senão o calc morre calado', () => {
    expect(styleSource).toMatch(/--iso-flow:\s*-?\d/)
  })
})

describe('o ícone acende o próprio gatilho, sem depender do card ao redor', () => {
  const hover = isoSource.match(/(^|[\s,}])\.iso:hover\s*\{([^}]*)\}/m)

  it('IsoBlock.vue — declara .iso:hover, com o seletor começando no próprio .iso', () => {
    expect(hover).not.toBeNull()
  })

  // o card acende 1; o ícone precisa passar disso, senão chegar com o mouse nele não muda nada na tela
  it('.iso — sob o mouse — acende --iso-hover acima do 1 que o card já acende', () => {
    const intensidade = Number(/--iso-hover:\s*([\d.]+)/.exec(hover?.[2] ?? '')?.[1])

    expect(intensidade).toBeGreaterThan(1)
  })

  it('--iso-spin-hover — o giro do hover — não existe mais em lugar nenhum', () => {
    expect(isoSource).not.toContain('--iso-spin-hover')
    expect(styleSource).not.toContain('--iso-spin-hover')
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
