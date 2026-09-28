import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { pipeline, type PipelineStep } from './pipeline'
import { phaseIconKeys, strokeIconKeys } from './strokeIcons'

const rootDir = fileURLToPath(new URL('..', import.meta.url))

function readSource(relativePath: string): string {
  return readFileSync(`${rootDir}/${relativePath}`, 'utf-8')
}

const pipelineSource = readSource('src/pipeline.ts')
const iconSource = readSource('src/components/StrokeIcon.vue')
const appSource = readSource('src/App.vue')

const GLYPH_RENDERED_BY_THE_OS = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/u

const named = pipeline.map((step): [string, PipelineStep] => [step.k, step])
const handled = [...iconSource.matchAll(/props\.icon === '([a-z-]+)'/g)].map((match) => match[1])

function branchOf(key: string): string | null {
  const match = iconSource.match(new RegExp(`props\\.icon === '${key}'">([\\s\\S]*?)</template>`))
  return match === null ? null : match[1]
}

describe('as seis fases nomeiam o ícone por chave', () => {
  it('pipeline — definição — traz as seis fases', () => {
    expect(pipeline).toHaveLength(phaseIconKeys.length)
  })

  it.each(named)('pipeline — fase %s — usa uma chave do alfabeto de traço', (_k, step) => {
    expect(phaseIconKeys).toContain(step.icon)
  })

  it.each(named)('pipeline — fase %s — nomeia o ícone por chave, não por emoji', (_k, step) => {
    expect(step.icon).toMatch(/^[a-z][a-z-]*$/)
  })

  it('pipeline — todas as fases — cobrem as chaves de fase sem repetir', () => {
    expect([...pipeline.map((step) => step.icon)].sort()).toEqual([...phaseIconKeys].sort())
  })
})

describe('nenhum emoji sobrou nas fases', () => {
  const fields = pipeline.flatMap((step): Array<[string, string]> => [
    [`${step.k} · icon`, step.icon],
    [`${step.k} · k`, step.k],
    [`${step.k} · d`, step.d],
  ])

  it.each(fields)('pipeline — campo %s — não casa com a faixa de emoji', (_label, value) => {
    expect(value).not.toMatch(GLYPH_RENDERED_BY_THE_OS)
  })

  it('pipeline.ts — o fonte inteiro — não contém emoji', () => {
    expect(pipelineSource).not.toMatch(GLYPH_RENDERED_BY_THE_OS)
  })
})

describe('cada fase renderiza o ramo de SVG da sua chave', () => {
  it.each(named)('StrokeIcon.vue — fase %s — tem ramo para a sua chave', (_k, step) => {
    expect(handled).toContain(step.icon)
  })

  it.each(named)('StrokeIcon.vue — fase %s — desenha traço, não um ramo vazio', (_k, step) => {
    expect(branchOf(step.icon)).toMatch(/<(path|rect|line)\b/)
  })

  it.each(named)('StrokeIcon.vue — fase %s — corre o traço por --iso-hover', (_k, step) => {
    expect(branchOf(step.icon)).toContain('stroke-icon-flow')
  })

  it('StrokeIcon.vue — as seis fases — têm desenhos distintos entre si', () => {
    const drawings = pipeline.map((step) => branchOf(step.icon))
    expect(new Set(drawings).size).toBe(drawings.length)
  })

  it('StrokeIcon.vue — os ramos — cobrem o alfabeto inteiro e nenhuma chave a mais', () => {
    expect([...handled].sort()).toEqual([...strokeIconKeys].sort())
  })

  it('StrokeIcon.vue — chave fora do alfabeto — cai num v-else visível, não num SVG vazio', () => {
    const fallback = iconSource.match(/<template v-else>([\s\S]*?)<\/template>/)
    expect(fallback).not.toBeNull()
    expect(fallback?.[1]).toMatch(/<(path|rect|line)\b/)
  })
})

describe('o card de fase responde a mouse e a teclado', () => {
  const card = appSource.match(/<ol class="steps">([\s\S]*?)<\/ol>/)

  it('App.vue — o card de fase — foi encontrado', () => {
    expect(card).not.toBeNull()
    expect(card?.[1]).toContain('in pipeline')
  })

  it('App.vue — o card de fase — renderiza StrokeIcon em vez de glifo do SO', () => {
    expect(card?.[1]).toContain('<StrokeIcon :icon="s.icon" />')
    expect(card?.[1]).not.toMatch(GLYPH_RENDERED_BY_THE_OS)
  })

  it('App.vue — o card de fase — é alcançável por teclado', () => {
    expect(card?.[1]).toMatch(/tabindex="0"/)
  })

  it('App.vue — o card de fase — dá ao foco o mesmo estado visual do hover', () => {
    const shared = appSource.match(/\.steps li:hover, \.steps li:focus-visible \{([^}]*)\}/)
    expect(shared).not.toBeNull()
    expect(shared?.[1]).toContain('--iso-hover: 1')
  })

  it('App.vue — o foco do card — tem anel visível apesar do clip-path', () => {
    const focusRule = appSource.match(/\n\.steps li:focus-visible \{([^}]*)\}/)
    expect(focusRule).not.toBeNull()
    expect(focusRule?.[1]).toContain('box-shadow: inset')
  })
})
