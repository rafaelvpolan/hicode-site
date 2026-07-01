import { describe, expect, it } from 'vitest'
import { pipeline, stepStyle, type PipelineStep } from './pipeline'

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
    const step: PipelineStep = { k: 'Teste', d: 'descricao', icon: '⚡', color: '#123456' }

    const style = stepStyle(step)

    expect(style.color).toBe('#123456')
  })

  it('stepStyle — with a given step — mixes the step color into the background', () => {
    const step: PipelineStep = { k: 'Teste', d: 'descricao', icon: '⚡', color: '#123456' }

    const style = stepStyle(step)

    expect(style.background).toBe('color-mix(in srgb, #123456 18%, transparent)')
  })

  it('stepStyle — with a given step — mixes the step color into the border color', () => {
    const step: PipelineStep = { k: 'Teste', d: 'descricao', icon: '⚡', color: '#123456' }

    const style = stepStyle(step)

    expect(style.borderColor).toBe('color-mix(in srgb, #123456 40%, transparent)')
  })

  it('stepStyle — with two different steps — produces different styles', () => {
    const stepA: PipelineStep = { k: 'A', d: 'a', icon: '⚡', color: '#111111' }
    const stepB: PipelineStep = { k: 'B', d: 'b', icon: '👁️', color: '#222222' }

    const styleA = stepStyle(stepA)
    const styleB = stepStyle(stepB)

    expect(styleA).not.toEqual(styleB)
  })
})
