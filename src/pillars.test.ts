import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { pillars, type Pillar } from './pillars'

const rootDir = fileURLToPath(new URL('..', import.meta.url))

function readSource(relativePath: string): string {
  return readFileSync(`${rootDir}/${relativePath}`, 'utf-8')
}

const pillarsSource = readSource('src/pillars.ts')
const iconSource = readSource('src/components/PillarIcon.vue')
const appSource = readSource('src/App.vue')

const GLYPH_RENDERED_BY_THE_OS = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/u

const named = pillars.map((pillar): [string, Pillar] => [pillar.title, pillar])

describe('os pilares do card sobre', () => {
  it('pillars — definição — traz os três pilares', () => {
    expect(pillars).toHaveLength(3)
  })

  it.each(named)('pillars — pilar %s — tem título não vazio', (_title, pillar) => {
    expect(pillar.title.trim().length).toBeGreaterThan(0)
  })

  it.each(named)('pillars — pilar %s — tem texto não vazio', (_title, pillar) => {
    expect(pillar.text.trim().length).toBeGreaterThan(0)
  })

  it('pillars — todos os pilares — têm chaves de ícone distintas', () => {
    const keys = pillars.map((pillar) => pillar.icon)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it.each(named)('pillars — pilar %s — nomeia o ícone por chave, não por emoji', (_title, pillar) => {
    expect(pillar.icon).toMatch(/^[a-z][a-z-]*$/)
  })
})

describe('nenhum emoji sobrou nos pilares', () => {
  const fields = pillars.flatMap((pillar): Array<[string, string]> => [
    [`${pillar.title} · icon`, pillar.icon],
    [`${pillar.title} · title`, pillar.title],
    [`${pillar.title} · text`, pillar.text],
  ])

  it.each(fields)('pillars — campo %s — não casa com a faixa de emoji', (_label, value) => {
    expect(value).not.toMatch(GLYPH_RENDERED_BY_THE_OS)
  })

  it('pillars.ts — o fonte inteiro — não contém emoji', () => {
    expect(pillarsSource).not.toMatch(GLYPH_RENDERED_BY_THE_OS)
  })

  it('App.vue — o IsoBlock dos pilares — renderiza PillarIcon em vez de glifo do SO', () => {
    const block = appSource.match(/<IsoBlock class="ic"[\s\S]*?<\/IsoBlock>/)
    expect(block).not.toBeNull()
    expect(block?.[0]).toContain('<PillarIcon :icon="p.icon" />')
    expect(block?.[0]).not.toMatch(GLYPH_RENDERED_BY_THE_OS)
  })
})

describe('PillarIcon cobre exatamente as chaves declaradas em pillars.ts', () => {
  const handled = [...iconSource.matchAll(/props\.icon === '([a-z-]+)'/g)].map((match) => match[1])

  it('PillarIcon.vue — ramos do template — foram encontrados', () => {
    expect(handled.length).toBeGreaterThan(0)
  })

  it('PillarIcon.vue — ramos do template — não repetem chave', () => {
    expect(new Set(handled).size).toBe(handled.length)
  })

  it('PillarIcon.vue — ramos do template — cobrem todas as chaves e nenhuma a mais', () => {
    expect([...handled].sort()).toEqual([...new Set(pillars.map((pillar) => pillar.icon))].sort())
  })
})

describe('PillarIcon fala o idioma de traço do BrandMark', () => {
  const strokeRules: Array<[string, RegExp]> = [
    ['stroke: currentColor', /stroke:\s*currentColor\s*;/],
    ['stroke-width: 2', /stroke-width:\s*2\s*;/],
    ['stroke-linecap: square', /stroke-linecap:\s*square\s*;/],
    ['stroke-linejoin: miter', /stroke-linejoin:\s*miter\s*;/],
    ['fill: none', /fill:\s*none\s*;/],
    ['aria-hidden', /aria-hidden="true"/],
    ['focusable="false"', /focusable="false"/],
  ]

  it.each(strokeRules)('PillarIcon.vue — declara %s', (_label, pattern) => {
    expect(iconSource).toMatch(pattern)
  })

  it('PillarIcon.vue — todo preenchimento — é none, nunca uma cor', () => {
    const attributeFills = [...iconSource.matchAll(/\bfill="([^"]*)"/g)].map((match) => match[1])
    const declaredFills = [...iconSource.matchAll(/(?:^|[\s;{])fill:\s*([^;\n]+)/gm)].map((match) =>
      match[1].trim(),
    )
    const fills = [...attributeFills, ...declaredFills]

    expect(fills.length).toBeGreaterThan(0)
    expect([...new Set(fills)]).toEqual(['none'])
  })

  it('PillarIcon.vue — a animação de traço — respeita prefers-reduced-motion', () => {
    const reduced = iconSource.match(/@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*?)\n\}/)
    expect(reduced).not.toBeNull()
    expect(reduced?.[1]).toContain('pillar-icon-flow')
  })

  it('PillarIcon.vue — o hover do card — move o traço via --iso-hover', () => {
    expect(iconSource).toMatch(/stroke-dashoffset:[^;]*var\(--iso-hover/)
  })
})

describe('App.vue não compensa mais o desalinhamento na mão', () => {
  it('App.vue — regra .card .ic — não tem margin-left negativo', () => {
    const rule = appSource.match(/\.card \.ic \{([^}]*)\}/)
    expect(rule).not.toBeNull()
    expect(rule?.[1]).not.toContain('margin-left')
  })

  it('App.vue — os pilares — vêm de ./pillars, não de um literal no componente', () => {
    expect(appSource).toContain("import { pillars } from './pillars'")
    expect(appSource).not.toMatch(/const pillars\s*=/)
  })
})
