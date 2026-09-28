import { describe, expect, it } from 'vitest'
import { useMobileMenu } from './useMobileMenu'

describe('useMobileMenu — initial state', () => {
  it('useMobileMenu — before any interaction — starts closed', () => {
    const { menuOpen } = useMobileMenu()

    expect(menuOpen.value).toBe(false)
  })
})

describe('useMobileMenu — toggleMenu', () => {
  it('useMobileMenu — toggleMenu on a closed menu — opens it', () => {
    const { menuOpen, toggleMenu } = useMobileMenu()

    toggleMenu()

    expect(menuOpen.value).toBe(true)
  })

  it('useMobileMenu — toggleMenu called twice — closes it again', () => {
    const { menuOpen, toggleMenu } = useMobileMenu()

    toggleMenu()
    toggleMenu()

    expect(menuOpen.value).toBe(false)
  })
})

describe('useMobileMenu — closeMenu', () => {
  it('useMobileMenu — closeMenu on an open menu — closes it', () => {
    const { menuOpen, toggleMenu, closeMenu } = useMobileMenu()

    toggleMenu()
    closeMenu()

    expect(menuOpen.value).toBe(false)
  })

  it('useMobileMenu — closeMenu on an already closed menu — stays closed', () => {
    const { menuOpen, closeMenu } = useMobileMenu()

    closeMenu()

    expect(menuOpen.value).toBe(false)
  })
})
