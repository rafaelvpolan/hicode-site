import { onMounted, ref, type Ref } from 'vue'

interface GithubStars {
  stars: Ref<number | null>
  loadingStars: Ref<boolean>
  fmtStars: (n: number) => string
}

function fmtStars(n: number): string {
  return n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '') + 'k' : String(n)
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
