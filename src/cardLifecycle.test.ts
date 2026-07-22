import { describe, expect, it } from 'vitest'
import { cardLifecycle, type CardLifecycleStage } from './cardLifecycle'

const validActors = new Set(['motor', 'humano'])

describe('cardLifecycle', () => {
  it('cardLifecycle — stages — has at least one stage', () => {
    expect(cardLifecycle.length).toBeGreaterThan(0)
  })

  it('cardLifecycle — all stages — ids are distinct', () => {
    const ids = cardLifecycle.map((stage) => stage.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it.each(cardLifecycle.map((stage): [string, CardLifecycleStage] => [stage.id, stage]))(
    'cardLifecycle — stage %s — has a non-empty label and detail',
    (_id, stage) => {
      expect(stage.label.length).toBeGreaterThan(0)
      expect(stage.detail.length).toBeGreaterThan(0)
    },
  )

  it.each(cardLifecycle.map((stage): [string, CardLifecycleStage] => [stage.id, stage]))(
    'cardLifecycle — stage %s — actor is either motor or humano',
    (_id, stage) => {
      expect(validActors.has(stage.actor)).toBe(true)
    },
  )

  it('cardLifecycle — first stage — is EXECUTED', () => {
    expect(cardLifecycle[0]?.id).toBe('EXECUTED')
  })

  it('cardLifecycle — last stage — is MERGE', () => {
    expect(cardLifecycle[cardLifecycle.length - 1]?.id).toBe('MERGE')
  })

  it('cardLifecycle — MERGE stage — actor is humano', () => {
    const merge = cardLifecycle.find((stage) => stage.id === 'MERGE')
    expect(merge?.actor).toBe('humano')
  })

  it('cardLifecycle — PREVIEW_OK stage — actor is humano', () => {
    const previewOk = cardLifecycle.find((stage) => stage.id === 'PREVIEW_OK')
    expect(previewOk?.actor).toBe('humano')
  })

  it('cardLifecycle — PREVIEW stage — appears before PREVIEW_OK', () => {
    const previewIndex = cardLifecycle.findIndex((stage) => stage.id === 'PREVIEW')
    const previewOkIndex = cardLifecycle.findIndex((stage) => stage.id === 'PREVIEW_OK')
    expect(previewIndex).toBeLessThan(previewOkIndex)
  })
})
