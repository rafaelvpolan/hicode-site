import { describe, expect, it } from 'vitest'
import { useGithubStars } from './useGithubStars'

describe('useGithubStars — initial state', () => {
  it('useGithubStars — before the GitHub fetch resolves — starts with stars as null', () => {
    const { stars } = useGithubStars()

    expect(stars.value).toBeNull()
  })

  it('useGithubStars — before the GitHub fetch resolves — starts in a loading state', () => {
    const { loadingStars } = useGithubStars()

    expect(loadingStars.value).toBe(true)
  })
})

describe('fmtStars', () => {
  it.each([
    [0, '0'],
    [1, '1'],
    [999, '999'],
    [1000, '1k'],
    [1500, '1.5k'],
    [10000, '10k'],
    [12345, '12.3k'],
    [999999, '1000k'],
  ])('fmtStars — with %i stars — formats as %s', (input, expected) => {
    const { fmtStars } = useGithubStars()

    expect(fmtStars(input)).toBe(expected)
  })
})
