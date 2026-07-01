import { describe, expect, it } from 'vitest'
import { fmtStars } from './stars'

describe('fmtStars', () => {
  it.each([
    [0, '0'],
    [1, '1'],
    [999, '999'],
  ])('fmtStars — n=%i below 1000 — returns plain number string', (input, expected) => {
    expect(fmtStars(input)).toBe(expected)
  })

  it('fmtStars — n=1000 at the thousand boundary — returns "1k" without decimal', () => {
    expect(fmtStars(1000)).toBe('1k')
  })

  it('fmtStars — n=1234 with a fractional thousand — returns "1.2k"', () => {
    expect(fmtStars(1234)).toBe('1.2k')
  })

  it('fmtStars — n=2000 an exact thousand above boundary — strips ".0" to return "2k"', () => {
    expect(fmtStars(2000)).toBe('2k')
  })
})
