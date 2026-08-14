import { describe, expect, it } from 'vitest'
import { showBrackets } from './cardBrackets'

describe('showBrackets', () => {
  it('showBrackets — default variant with bracketed true — shows brackets', () => {
    expect(showBrackets('default', true)).toBe(true)
  })

  it('showBrackets — default variant with bracketed false — hides brackets', () => {
    expect(showBrackets('default', false)).toBe(false)
  })

  it('showBrackets — star variant with bracketed true — hides brackets', () => {
    expect(showBrackets('star', true)).toBe(false)
  })

  it('showBrackets — star variant with bracketed false — hides brackets', () => {
    expect(showBrackets('star', false)).toBe(false)
  })
})
