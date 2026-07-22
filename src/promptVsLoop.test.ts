import { describe, expect, it } from 'vitest'
import { promptVsLoop, type PromptVsLoopRow } from './promptVsLoop'

describe('promptVsLoop', () => {
  it('promptVsLoop — rows — has at least one entry', () => {
    expect(promptVsLoop.length).toBeGreaterThan(0)
  })

  it.each(promptVsLoop.map((row): [string, PromptVsLoopRow] => [row.without, row]))(
    'promptVsLoop — row %s — has a non-empty "without" and "with" side',
    (_without, row) => {
      expect(row.without.length).toBeGreaterThan(0)
      expect(row.with.length).toBeGreaterThan(0)
    },
  )

  it('promptVsLoop — all rows — "without" sides are distinct', () => {
    const withoutSides = promptVsLoop.map((row) => row.without)
    const uniqueSides = new Set(withoutSides)
    expect(uniqueSides.size).toBe(withoutSides.length)
  })
})
