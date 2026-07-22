import { describe, expect, it } from 'vitest'
import { faq, type FaqItem } from './faq'

describe('faq', () => {
  it('faq — catalog — has at least one entry', () => {
    expect(faq.length).toBeGreaterThan(0)
  })

  it.each(faq.map((item): [string, FaqItem] => [item.q, item]))(
    'faq — question %s — has a non-empty question and answer',
    (_q, item) => {
      expect(item.q.length).toBeGreaterThan(0)
      expect(item.a.length).toBeGreaterThan(0)
    },
  )

  it('faq — all entries — questions are distinct', () => {
    const questions = faq.map((item) => item.q)
    const uniqueQuestions = new Set(questions)
    expect(uniqueQuestions.size).toBe(questions.length)
  })
})
