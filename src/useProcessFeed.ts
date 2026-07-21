import { onScopeDispose, ref, watch, type ComputedRef, type Ref } from 'vue'
import { createProcessTask, processStageCount } from './processCatalog'
import type { ProcessTask } from './engineTypes'

const MAX_CONCURRENT_TASKS = 4
const SPARK_DURATION_MS = 420
const BASE_TICK_MS = 1500
const MIN_TICK_MS = 520

export interface UseProcessFeedOptions {
  isRunning: Ref<boolean> | ComputedRef<boolean>
  rpmFraction: Ref<number> | ComputedRef<number>
}

export interface UseProcessFeedReturn {
  tasks: Ref<ProcessTask[]>
}

export function useProcessFeed(options: UseProcessFeedOptions): UseProcessFeedReturn {
  const tasks = ref<ProcessTask[]>([])
  let tickTimeout: ReturnType<typeof setTimeout> | undefined
  const sparkTimeouts = new Set<ReturnType<typeof setTimeout>>()

  function stopTicking(): void {
    if (tickTimeout !== undefined) {
      clearTimeout(tickTimeout)
      tickTimeout = undefined
    }
  }

  function stopSparkTimeouts(): void {
    sparkTimeouts.forEach((timeout) => clearTimeout(timeout))
    sparkTimeouts.clear()
  }

  function clearSpark(taskId: string): void {
    tasks.value = tasks.value.map((task) => (task.id === taskId ? { ...task, spark: false } : task))
  }

  function scheduleSparkClear(taskId: string): void {
    const timeout = setTimeout(() => {
      clearSpark(taskId)
      sparkTimeouts.delete(timeout)
    }, SPARK_DURATION_MS)
    sparkTimeouts.add(timeout)
  }

  function advanceTask(task: ProcessTask): ProcessTask {
    const isFinalStage = task.stageIndex >= processStageCount - 1
    const advanced = isFinalStage ? createProcessTask(0) : { ...task, stageIndex: task.stageIndex + 1 }
    scheduleSparkClear(advanced.id)
    return { ...advanced, spark: true }
  }

  function nextTickDelay(): number {
    const eased = BASE_TICK_MS - options.rpmFraction.value * (BASE_TICK_MS - MIN_TICK_MS)
    return Math.max(MIN_TICK_MS, Math.round(eased))
  }

  function scheduleNextTick(): void {
    tickTimeout = setTimeout(() => {
      tasks.value = tasks.value.map(advanceTask)
      if (options.isRunning.value) {
        scheduleNextTick()
      }
    }, nextTickDelay())
  }

  function spawnInitialTasks(): ProcessTask[] {
    return Array.from({ length: MAX_CONCURRENT_TASKS }, (_unused, index) => createProcessTask(index))
  }

  watch(
    options.isRunning,
    (running) => {
      stopTicking()
      stopSparkTimeouts()
      if (running) {
        tasks.value = spawnInitialTasks()
        scheduleNextTick()
      } else {
        tasks.value = []
      }
    },
    { immediate: true },
  )

  onScopeDispose(() => {
    stopTicking()
    stopSparkTimeouts()
  })

  return { tasks }
}
