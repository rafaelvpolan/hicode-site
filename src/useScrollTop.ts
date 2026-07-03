import { onMounted, onUnmounted, ref, type Ref } from 'vue'

interface ScrollTop {
  showScrollTop: Ref<boolean>
  scrollToTop: () => void
}

export function useScrollTop(): ScrollTop {
  const showScrollTop = ref(false)

  function onScroll(): void {
    showScrollTop.value = window.scrollY > 300
  }

  function scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })

  return { showScrollTop, scrollToTop }
}
