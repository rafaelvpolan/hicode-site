import { describe, expect, it } from 'vitest'
import { parseSemver, satisfiesRange } from './semver-range'

describe('parseSemver', () => {
  it('parseSemver — a plain major.minor.patch string — returns its numeric parts', () => {
    expect(parseSemver('4.1.10')).toEqual({ major: 4, minor: 1, patch: 10 })
  })

  it('parseSemver — a version with a pre-release suffix — ignores the suffix', () => {
    expect(parseSemver('4.1.10-beta.1')).toEqual({ major: 4, minor: 1, patch: 10 })
  })

  it('parseSemver — a non-semver string — throws', () => {
    expect(() => parseSemver('not-a-version')).toThrow()
  })
})

describe('satisfiesRange', () => {
  it.each([
    ['4.1.10', '^4.1.9', true],
    ['4.1.9', '^4.1.9', true],
    ['4.2.0', '^4.1.9', true],
    ['5.0.0', '^4.1.9', false],
    ['4.1.8', '^4.1.9', false],
  ])(
    'satisfiesRange — version %s against caret range %s — returns %s',
    (version, range, expected) => {
      expect(satisfiesRange(version, range)).toBe(expected)
    },
  )

  it.each([
    ['5.7.3', '~5.7.2', true],
    ['5.7.2', '~5.7.2', true],
    ['5.8.0', '~5.7.2', false],
    ['5.7.1', '~5.7.2', false],
  ])(
    'satisfiesRange — version %s against tilde range %s — returns %s',
    (version, range, expected) => {
      expect(satisfiesRange(version, range)).toBe(expected)
    },
  )

  it('satisfiesRange — an exact range with a matching version — returns true', () => {
    expect(satisfiesRange('3.5.13', '3.5.13')).toBe(true)
  })

  it('satisfiesRange — an exact range with a different version — returns false', () => {
    expect(satisfiesRange('3.5.14', '3.5.13')).toBe(false)
  })

  it('satisfiesRange — a caret range on a 0.x base — only allows patch bumps', () => {
    expect(satisfiesRange('0.2.5', '^0.2.3')).toBe(true)
    expect(satisfiesRange('0.3.0', '^0.2.3')).toBe(false)
  })
})
