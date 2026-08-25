import { onMounted, onUnmounted, ref, type Ref } from 'vue'

interface HudClock {
  hudDate: Ref<string>
  hudTime: Ref<string>
}

export function formatHudDate(at: Date): string {
  const year = at.getFullYear()
  const month = String(at.getMonth() + 1).padStart(2, '0')
  const day = String(at.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

export function formatHudTime(at: Date): string {
  const hours = String(at.getHours()).padStart(2, '0')
  const minutes = String(at.getMinutes()).padStart(2, '0')
  const seconds = String(at.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

export function useHudClock(): HudClock {
  const hudDate = ref('')
  const hudTime = ref('')
  let timer: ReturnType<typeof setInterval> | undefined

  function tick(): void {
    const now = new Date()
    hudDate.value = formatHudDate(now)
    hudTime.value = formatHudTime(now)
  }

  onMounted(() => {
    tick()
    timer = setInterval(tick, 1000)
  })

  onUnmounted(() => {
    clearInterval(timer)
  })

  return { hudDate, hudTime }
}
