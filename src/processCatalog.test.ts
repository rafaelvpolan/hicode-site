import { describe, expect, it } from 'vitest'
import {
  createProcessTask,
  formatCardId,
  pickProcessAgent,
  processAgents,
  processStageCount,
  stageColor,
  stageLabel,
} from './processCatalog'
import { pipeline } from './pipeline'

describe('formatCardId', () => {
  it('formatCardId — with a small number — pads to three digits with a hash prefix', () => {
    expect(formatCardId(7)).toBe('#007')
  })

  it('formatCardId — with a three digit number — keeps it unpadded beyond three digits', () => {
    expect(formatCardId(123)).toBe('#123')
  })
})

describe('pickProcessAgent', () => {
  it('pickProcessAgent — called repeatedly — always returns a known agent name', () => {
    for (let i = 0; i < 20; i += 1) {
      expect(processAgents).toContain(pickProcessAgent())
    }
  })
})

describe('stageLabel and stageColor', () => {
  it('stageLabel — with a valid index — matches the pipeline step key', () => {
    expect(stageLabel(0)).toBe(pipeline[0]?.k)
  })

  it('stageColor — with a valid index — matches the pipeline step color', () => {
    expect(stageColor(0)).toBe(pipeline[0]?.color)
  })

  it('stageLabel — with an out of range index — falls back to the first stage', () => {
    expect(stageLabel(999)).toBe(pipeline[0]?.k)
  })

  it('processStageCount — matches the number of pipeline steps', () => {
    expect(processStageCount).toBe(pipeline.length)
  })
})

describe('createProcessTask', () => {
  it('createProcessTask — called twice — returns tasks with distinct ids', () => {
    const first = createProcessTask(0)
    const second = createProcessTask(0)
    expect(first.id).not.toBe(second.id)
  })

  it('createProcessTask — at stage zero — is not sparking', () => {
    const task = createProcessTask(0)
    expect(task.spark).toBe(false)
  })

  it('createProcessTask — beyond stage zero — starts sparking', () => {
    const task = createProcessTask(2)
    expect(task.spark).toBe(true)
  })

  it('createProcessTask — assigns a card id in the expected format', () => {
    const task = createProcessTask(0)
    expect(task.cardId).toMatch(/^#\d{3}$/)
  })
})
