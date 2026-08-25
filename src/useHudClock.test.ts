import { describe, expect, it } from 'vitest'
import { formatHudDate, formatHudTime } from './useHudClock'

describe('formatHudDate', () => {
  it('formatHudDate — with a mid-year date — renders YYYY.MM.DD', () => {
    expect(formatHudDate(new Date(2026, 7, 24, 9, 5, 3))).toBe('2026.08.24')
  })

  it('formatHudDate — with a single-digit month and day — pads both to two digits', () => {
    expect(formatHudDate(new Date(2026, 0, 2, 0, 0, 0))).toBe('2026.01.02')
  })
})

describe('formatHudTime', () => {
  it('formatHudTime — with a single-digit hour, minute and second — pads all three', () => {
    expect(formatHudTime(new Date(2026, 7, 24, 9, 5, 3))).toBe('09:05:03')
  })

  it('formatHudTime — with a late evening time — keeps the 24h clock', () => {
    expect(formatHudTime(new Date(2026, 7, 24, 23, 59, 59))).toBe('23:59:59')
  })

  it('formatHudTime — at midnight — renders 00:00:00', () => {
    expect(formatHudTime(new Date(2026, 7, 24, 0, 0, 0))).toBe('00:00:00')
  })
})
