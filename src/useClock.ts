import { onBeforeUnmount, onMounted, ref } from 'vue'

const TIME_FMT = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
const DATE_FMT = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
const WEEKDAY_FMT = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' })

export function useClock() {
  const time = ref('--:--:--')
  const date = ref('--/--/----')
  const weekday = ref('')
  let timer: ReturnType<typeof setInterval> | undefined

  function tick(): void {
    const now = new Date()
    time.value = TIME_FMT.format(now)
    date.value = DATE_FMT.format(now)
    weekday.value = WEEKDAY_FMT.format(now)
  }

  onMounted(() => {
    tick()
    timer = setInterval(tick, 1000)
  })

  onBeforeUnmount(() => {
    if (timer !== undefined) clearInterval(timer)
  })

  return { time, date, weekday }
}
