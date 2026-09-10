import { onMounted, onUnmounted, ref, type Ref } from 'vue'

interface MobileMenu {
  menuOpen: Ref<boolean>
  toggleMenu: () => void
  closeMenu: () => void
}

export function useMobileMenu(): MobileMenu {
  const menuOpen = ref(false)

  function lockBodyScroll(): void {
    if (typeof document === 'undefined') return
    document.body.style.overflow = 'hidden'
  }

  function unlockBodyScroll(): void {
    if (typeof document === 'undefined') return
    document.body.style.overflow = ''
  }

  function toggleMenu(): void {
    menuOpen.value = !menuOpen.value
    if (menuOpen.value) lockBodyScroll()
    else unlockBodyScroll()
  }

  function closeMenu(): void {
    if (!menuOpen.value) return
    menuOpen.value = false
    unlockBodyScroll()
  }

  function onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') closeMenu()
  }

  onMounted(() => {
    if (typeof document === 'undefined') return
    document.addEventListener('keydown', onKeydown)
  })

  onUnmounted(() => {
    if (typeof document === 'undefined') return
    document.removeEventListener('keydown', onKeydown)
    unlockBodyScroll()
  })

  return { menuOpen, toggleMenu, closeMenu }
}
