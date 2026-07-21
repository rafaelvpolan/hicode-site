import { computed, onScopeDispose, ref, type ComputedRef, type Ref } from 'vue'

export type IgnitionState = 'idle' | 'cranking' | 'running'

const IDLE_RPM = 0
const CRANK_RPM = 2200
const RUNNING_RPM = 7400
const MAX_RPM = 9000
const CRANK_DURATION_MS = 650
const RPM_TICK_MS = 45
const RPM_STEP = 260

export interface UseIgnitionReturn {
  state: Ref<IgnitionState>
  rpm: Ref<number>
  displayRpm: ComputedRef<number>
  rpmFraction: ComputedRef<number>
  isRunning: ComputedRef<boolean>
  isCranking: ComputedRef<boolean>
  statusLabel: ComputedRef<string>
  buttonLabel: ComputedRef<string>
  srStatusLabel: ComputedRef<string>
  toggle: () => void
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useIgnition(): UseIgnitionReturn {
  const state = ref<IgnitionState>('idle')
  const rpm = ref<number>(IDLE_RPM)
  let rpmInterval: ReturnType<typeof setInterval> | undefined
  let crankTimeout: ReturnType<typeof setTimeout> | undefined

  function stopRpmSweep(): void {
    if (rpmInterval !== undefined) {
      clearInterval(rpmInterval)
      rpmInterval = undefined
    }
  }

  function sweepRpmTo(target: number): void {
    stopRpmSweep()
    rpmInterval = setInterval(() => {
      const direction = target > rpm.value ? 1 : -1
      const next = rpm.value + direction * RPM_STEP
      const arrived = direction > 0 ? next >= target : next <= target
      rpm.value = arrived ? target : next
      if (arrived) {
        stopRpmSweep()
      }
    }, RPM_TICK_MS)
  }

  function clearCrankTimeout(): void {
    if (crankTimeout !== undefined) {
      clearTimeout(crankTimeout)
      crankTimeout = undefined
    }
  }

  function ignite(): void {
    if (prefersReducedMotion()) {
      state.value = 'running'
      rpm.value = RUNNING_RPM
      return
    }
    state.value = 'cranking'
    sweepRpmTo(CRANK_RPM)
    crankTimeout = setTimeout(() => {
      state.value = 'running'
      sweepRpmTo(RUNNING_RPM)
    }, CRANK_DURATION_MS)
  }

  function shutdown(): void {
    clearCrankTimeout()
    state.value = 'idle'
    if (prefersReducedMotion()) {
      rpm.value = IDLE_RPM
      return
    }
    sweepRpmTo(IDLE_RPM)
  }

  function toggle(): void {
    if (state.value === 'idle') {
      ignite()
    } else {
      shutdown()
    }
  }

  onScopeDispose(() => {
    stopRpmSweep()
    clearCrankTimeout()
  })

  const displayRpm = computed<number>(() => Math.round(rpm.value))
  const rpmFraction = computed<number>(() => rpm.value / MAX_RPM)
  const isRunning = computed<boolean>(() => state.value === 'running')
  const isCranking = computed<boolean>(() => state.value === 'cranking')
  const statusLabel = computed<string>(() => {
    if (state.value === 'cranking') return 'IGNICAO_EM_CURSO'
    if (state.value === 'running') return 'MOTOR_EM_MARCHA'
    return 'MOTOR_EM_ESPERA'
  })
  const buttonLabel = computed<string>(() => (state.value === 'idle' ? 'LIGAR MOTOR' : 'DESLIGAR MOTOR'))
  const srStatusLabel = computed<string>(() => {
    if (state.value === 'cranking') return 'Motor ligando, rotações subindo.'
    if (state.value === 'running') return 'Motor em marcha, rotações estabilizadas.'
    return 'Motor desligado, em espera.'
  })

  return {
    state,
    rpm,
    displayRpm,
    rpmFraction,
    isRunning,
    isCranking,
    statusLabel,
    buttonLabel,
    srStatusLabel,
    toggle,
  }
}
