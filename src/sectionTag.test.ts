import { describe, expect, it } from 'vitest'
import { sectionTag } from './sectionTag'

describe('sectionTag', () => {
  it('sectionTag — with index zero — pads to two digits starting at one', () => {
    expect(sectionTag('SEC', 0)).toBe('SEC_01')
  })

  it('sectionTag — with a single digit index — pads with a leading zero', () => {
    expect(sectionTag('SEC', 8)).toBe('SEC_09')
  })

  it('sectionTag — with a two digit index — keeps both digits unpadded', () => {
    expect(sectionTag('SEC', 98)).toBe('SEC_99')
  })

  it('sectionTag — with an index beyond two digits — does not truncate', () => {
    expect(sectionTag('SEC', 99)).toBe('SEC_100')
  })

  it('sectionTag — with a different prefix — uses that prefix verbatim', () => {
    expect(sectionTag('FAQ', 2)).toBe('FAQ_03')
  })

  it('sectionTag — with an empty prefix — still produces a padded suffix', () => {
    expect(sectionTag('', 0)).toBe('_01')
  })
})
