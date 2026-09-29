import { describe, expect, it, vi } from 'vitest'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import App from './App.vue'
import StrokeIcon from './components/StrokeIcon.vue'
import { pipeline, stepStyle, type PipelineStep } from './pipeline'
import type { StrokeIconKey } from './strokeIcons'

const hexColorPattern = /^#[0-9a-fA-F]{6}$/

describe('pipeline', () => {
  it('pipeline — definition — has at least one step', () => {
    expect(pipeline.length).toBeGreaterThan(0)
  })

  it.each(pipeline.map((step): [string, PipelineStep] => [step.k, step]))(
    'pipeline — step %s — has a non-empty color in hex format',
    (_k, step) => {
      expect(step.color).toMatch(hexColorPattern)
    },
  )

  it.each(pipeline.map((step): [string, PipelineStep] => [step.k, step]))(
    'pipeline — step %s — has a non-empty icon',
    (_k, step) => {
      expect(step.icon.length).toBeGreaterThan(0)
    },
  )

  it('pipeline — all steps — colors are distinct across steps', () => {
    const colors = pipeline.map((step) => step.color)
    const uniqueColors = new Set(colors)
    expect(uniqueColors.size).toBe(colors.length)
  })

  it('pipeline — all steps — icons are distinct across steps', () => {
    const icons = pipeline.map((step) => step.icon)
    const uniqueIcons = new Set(icons)
    expect(uniqueIcons.size).toBe(icons.length)
  })

  it('pipeline — all steps — keys are distinct across steps', () => {
    const keys = pipeline.map((step) => step.k)
    const uniqueKeys = new Set(keys)
    expect(uniqueKeys.size).toBe(keys.length)
  })
})

describe('stepStyle', () => {
  it('stepStyle — with a given step — uses the step color for the text color', () => {
    const step: PipelineStep = { k: 'Teste', d: 'descricao', icon: 'run', color: '#123456' }

    const style = stepStyle(step)

    expect(style.color).toBe('#123456')
  })

  it('stepStyle — with a given step — mixes the step color into the background', () => {
    const step: PipelineStep = { k: 'Teste', d: 'descricao', icon: 'run', color: '#123456' }

    const style = stepStyle(step)

    expect(style.background).toBe('color-mix(in srgb, #123456 18%, transparent)')
  })

  it('stepStyle — with a given step — mixes the step color into the border color', () => {
    const step: PipelineStep = { k: 'Teste', d: 'descricao', icon: 'run', color: '#123456' }

    const style = stepStyle(step)

    expect(style.borderColor).toBe('color-mix(in srgb, #123456 40%, transparent)')
  })

  it('stepStyle — with two different steps — produces different styles', () => {
    const stepA: PipelineStep = { k: 'A', d: 'a', icon: 'run', color: '#111111' }
    const stepB: PipelineStep = { k: 'B', d: 'b', icon: 'preview', color: '#222222' }

    const styleA = stepStyle(stepA)
    const styleB = stepStyle(stepB)

    expect(styleA).not.toEqual(styleB)
  })
})

const GLYPH_RENDERED_BY_THE_OS = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/u
const KEY_OUTSIDE_THE_ALPHABET = 'quimera'

function mountIcon(icon: string): Promise<string> {
  return renderToString(createSSRApp(StrokeIcon, { icon } as { icon: StrokeIconKey }))
}

function signatureOf(svg: string): string {
  const [first] = [...svg.matchAll(/\bd="([^"]+)"/g)].map((match) => match[1])
  if (first === undefined) throw new Error('o ramo renderizado não tem nenhum traço')
  return first
}

function mountApp(): Promise<string> {
  return renderToString(createSSRApp(App))
}

function phaseRegionOf(html: string): string {
  const region = html.match(/<ol class="steps"[^>]*>([\s\S]*?)<\/ol>/)
  if (region === null) throw new Error('a lista de fases não foi renderizada')
  return region[1]
}

function phaseCardsOf(region: string): string[] {
  return region.split(/(?=<li[\s>])/).filter((chunk) => chunk.startsWith('<li'))
}

function openingTagOf(chunk: string): string {
  const tag = chunk.match(/^<li[^>]*>/)
  if (tag === null) throw new Error('o card de fase não abriu como <li>')
  return tag[0]
}

const phaseRegion = phaseRegionOf(await mountApp())
const phaseCards = phaseCardsOf(phaseRegion)
const signatureByKey = new Map<string, string>(
  await Promise.all(
    pipeline.map(async (step) => [step.icon, signatureOf(await mountIcon(step.icon))] as const),
  ),
)
const fallbackSignature = signatureOf(await mountIcon(KEY_OUTSIDE_THE_ALPHABET))

function signatureFor(icon: string): string {
  const signature = signatureByKey.get(icon)
  if (signature === undefined) throw new Error(`a chave ${icon} não foi montada`)
  return signature
}

const indexedPhases = pipeline.map((step, index): [string, PipelineStep, number] => [
  step.k,
  step,
  index,
])

describe('o card do pipeline montado renderiza as seis fases', () => {
  it('a lista de fases — traz um card por fase, na ordem de pipeline.ts', () => {
    expect(phaseCards).toHaveLength(pipeline.length)
  })

  it.each(indexedPhases)('fase %s — mostra o nome e a descrição da própria fase', (_k, step, i) => {
    expect(phaseCards[i]).toContain(step.k)
    expect(phaseCards[i]).toContain(step.d)
  })

  it.each(indexedPhases)('fase %s — renderiza um SVG de traço, não um glifo do SO', (_k, _s, i) => {
    expect(phaseCards[i]).toContain('<svg')
    expect(phaseCards[i]).not.toMatch(GLYPH_RENDERED_BY_THE_OS)
  })

  it.each(indexedPhases)('fase %s — desenha o ramo da sua chave', (_k, step, i) => {
    expect(phaseCards[i]).toContain(signatureFor(step.icon))
  })

  it.each(indexedPhases)('fase %s — não desenha o ramo de outra fase', (_k, step, i) => {
    const others = pipeline.filter((other) => other.icon !== step.icon)
    for (const other of others) {
      expect(phaseCards[i]).not.toContain(signatureFor(other.icon))
    }
  })

  it.each(indexedPhases)('fase %s — não cai na cruz de chave desconhecida', (_k, _s, i) => {
    expect(phaseCards[i]).not.toContain(fallbackSignature)
  })

  it.each(indexedPhases)('fase %s — carrega a própria cor de estágio', (_k, step, i) => {
    expect(phaseCards[i]).toContain(step.color)
  })
})

describe('cada card de fase montado é alcançável por teclado', () => {
  it.each(indexedPhases)('fase %s — abre como <li> focável por tabindex', (_k, _s, i) => {
    expect(openingTagOf(phaseCards[i])).toMatch(/\btabindex="0"/)
  })

  it('a lista de fases — não deixa nenhum card fora da ordem de tabulação', () => {
    const focusable = [...phaseRegion.matchAll(/\btabindex="0"/g)]
    expect(focusable).toHaveLength(pipeline.length)
  })
})

describe('nenhum emoji sobrou nas fases montadas', () => {
  const fields = pipeline.flatMap((step): Array<[string, string]> => [
    [`${step.k} · icon`, step.icon],
    [`${step.k} · k`, step.k],
    [`${step.k} · d`, step.d],
  ])

  it.each(fields)('pipeline — campo %s — não casa com a faixa de emoji', (_label, value) => {
    expect(value).not.toMatch(GLYPH_RENDERED_BY_THE_OS)
  })

  it('a lista de fases montada — não traz glifo do SO em lugar nenhum', () => {
    expect(phaseRegion).not.toMatch(GLYPH_RENDERED_BY_THE_OS)
  })
})

const UNRESOLVED_COMPONENT_WARNING = 'Failed to resolve component'

async function warningsWhileMounting(): Promise<string[]> {
  const collected: string[] = []
  const spy = vi.spyOn(console, 'warn').mockImplementation((...args: unknown[]) => {
    collected.push(args.map((arg) => String(arg)).join(' '))
  })
  try {
    await mountApp()
  } finally {
    spy.mockRestore()
  }
  return collected
}

describe('o App.vue monta sem nenhum stub registrado', () => {
  it('App.vue — sem stub global — monta e entrega a lista de fases', async () => {
    const html = await mountApp()

    expect(phaseCardsOf(phaseRegionOf(html))).toHaveLength(pipeline.length)
  })

  it('App.vue — sem stub global — não avisa componente não resolvido', async () => {
    const warnings = await warningsWhileMounting()

    expect(warnings.filter((w) => w.includes(UNRESOLVED_COMPONENT_WARNING))).toEqual([])
  })
})
