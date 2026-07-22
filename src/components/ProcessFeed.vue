<script setup lang="ts">
import ProcessTaskChip from './ProcessTaskChip.vue'
import type { ProcessTask } from '../engineTypes'

interface ProcessFeedProps {
  tasks: ProcessTask[]
  isRunning: boolean
}

defineProps<ProcessFeedProps>()
</script>

<template>
  <div class="feed" :class="{ 'is-idle': !isRunning }">
    <div class="feed-head">
      <span class="feed-label">PROCESSOS_HII</span>
      <span class="feed-count">{{ isRunning ? `${tasks.length} EM EXECUÇÃO` : 'MOTOR EM ESPERA' }}</span>
    </div>
    <TransitionGroup tag="ul" name="chip-row" class="feed-list" aria-hidden="true">
      <ProcessTaskChip v-for="task in tasks" :key="task.id" :task="task" />
    </TransitionGroup>
    <p v-if="!isRunning" class="feed-empty">Ligue o motor para ver os processos do hii rodando ao vivo.</p>
  </div>
</template>

<style scoped>
.feed {
  margin-top: var(--space-7);
  padding-top: var(--space-6);
  border-top: 1px dashed var(--bd);
}

.feed-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  letter-spacing: 0.14em;
  color: var(--mut);
  margin-bottom: var(--space-3);
}

.feed.is-idle .feed-count {
  color: var(--mut);
}

.feed:not(.is-idle) .feed-count {
  color: var(--acc2);
}

.feed-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  min-height: 40px;
}

.feed-empty {
  margin: var(--space-3) 0 0;
  color: var(--mut);
  font-size: var(--fs-md);
}

.chip-row-enter-active,
.chip-row-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.chip-row-enter-from,
.chip-row-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.chip-row-leave-active {
  position: absolute;
}

@media (prefers-reduced-motion: reduce) {
  .chip-row-enter-active,
  .chip-row-leave-active {
    transition: none;
  }
}
</style>
