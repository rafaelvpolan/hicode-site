<script setup lang="ts">
import { stageColor, stageLabel, processStageCount } from '../processCatalog'
import type { ProcessTask } from '../engineTypes'

interface ProcessTaskChipProps {
  task: ProcessTask
}

defineProps<ProcessTaskChipProps>()

const stageIndices = Array.from({ length: processStageCount }, (_unused, index) => index)
</script>

<template>
  <li
    class="chip"
    :class="{ 'is-sparking': task.spark }"
    :style="{ '--chip-color': stageColor(task.stageIndex) }"
  >
    <span class="chip-id">{{ task.cardId }}</span>
    <span class="chip-agent">{{ task.agent }}</span>
    <span class="chip-stage">{{ stageLabel(task.stageIndex) }}</span>
    <span class="chip-dots">
      <i
        v-for="stageIndex in stageIndices"
        :key="stageIndex"
        :class="{ 'is-past': stageIndex < task.stageIndex, 'is-current': stageIndex === task.stageIndex }"
        :style="{ '--dot-color': stageColor(stageIndex) }"
      ></i>
    </span>
  </li>
</template>

<style scoped>
.chip {
  --chip-color: var(--acc);
  position: relative;
  display: grid;
  grid-template-columns: auto auto 1fr;
  align-items: center;
  gap: 6px 12px;
  background: var(--panel2);
  border: 1px solid var(--bd);
  border-left: 3px solid var(--chip-color);
  clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
  padding: 9px 12px;
  font-family: var(--font-mono);
  font-size: 12px;
  transition: border-color 0.4s ease, box-shadow 0.4s ease;
}

.chip.is-sparking {
  border-left-color: var(--chip-color);
  box-shadow: -6px 0 18px -4px var(--chip-color);
}

.chip-id {
  color: var(--tx);
  font-weight: 700;
}

.chip-agent {
  color: var(--mut);
  text-transform: lowercase;
}

.chip-stage {
  grid-column: 3;
  justify-self: end;
  color: var(--chip-color);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 11px;
}

.chip-dots {
  grid-column: 1 / -1;
  display: flex;
  gap: 4px;
}

.chip-dots i {
  --dot-color: var(--bd);
  width: 14px;
  height: 3px;
  background: color-mix(in srgb, var(--dot-color) 25%, var(--bd));
  border-radius: 2px;
}

.chip-dots i.is-past {
  background: color-mix(in srgb, var(--dot-color) 55%, var(--bd));
}

.chip-dots i.is-current {
  background: var(--dot-color);
  box-shadow: 0 0 8px var(--dot-color);
}

@media (prefers-reduced-motion: reduce) {
  .chip {
    transition: none;
  }
}
</style>
