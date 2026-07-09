import { onMounted, ref, type Ref } from 'vue'
import { fmtStars } from './lib/stars'

interface GithubStars {
  stars: Ref<number | null>
  loadingStars: Ref<boolean>
  fmtStars: (n: number) => string
}

export function useGithubStars(): GithubStars {
  const stars = ref<number | null>(null)
  const loadingStars = ref(true)

  onMounted(async () => {
    try {
      const r = await fetch('https://api.github.com/repos/rafaelvpolan/hicode')
      if (r.ok) {
        const d = (await r.json()) as { stargazers_count?: unknown }
        stars.value = typeof d.stargazers_count === 'number' ? d.stargazers_count : null
      }
    } catch {
      stars.value = null
    } finally {
      loadingStars.value = false
    }
  })

  return { stars, loadingStars, fmtStars }
}
