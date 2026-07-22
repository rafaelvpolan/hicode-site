<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { promptVsLoop } from '../promptVsLoop'

function rowDelay(index: number): CSSProperties {
  return { animationDelay: `${index * 0.4}s` }
}
</script>

<template>
  <div class="matrix-wrap">
    <table class="matrix">
      <caption class="sr-only">Comparação entre trabalhar com prompts avulsos e trabalhar com loops do hiignation</caption>
      <thead>
        <tr>
          <th scope="col" class="without">Sem loop</th>
          <th scope="col" class="with">Com hiignation</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in promptVsLoop" :key="row.without">
          <td class="without" :style="rowDelay(i)">{{ row.without }}</td>
          <td class="with">{{ row.with }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.matrix-wrap {
  position: relative;
}

.matrix-wrap::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 6px;
  transform: translateX(-50%);
  background: repeating-linear-gradient(135deg, var(--hazard) 0 14px, transparent 14px 28px);
  opacity: 0.45;
  z-index: 0;
}

.matrix {
  position: relative;
  width: 100%;
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0 10px;
  z-index: 1;
}

.matrix th {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-align: left;
  padding: 0 20px 10px;
}

.matrix th.without {
  color: var(--mut);
}

.matrix th.with {
  color: var(--acc2);
}

.matrix td {
  background: var(--panel);
  border: 1px solid var(--bd);
  padding: 16px 20px;
  font-size: 14.5px;
  vertical-align: top;
}

.matrix td.without {
  color: var(--mut);
  border-right: none;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  animation: memoryFlicker 3.6s ease-in-out infinite;
}

.matrix td.with {
  color: var(--tx);
  border-left: none;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--acc) 22%, transparent);
}

@keyframes memoryFlicker {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.55;
  }
}

@media (max-width: 720px) {
  .matrix-wrap::before {
    display: none;
  }

  .matrix,
  .matrix thead,
  .matrix tbody,
  .matrix tr {
    display: block;
  }

  .matrix th {
    display: none;
  }

  .matrix tr {
    margin-bottom: 10px;
  }

  .matrix td {
    display: block;
    border-radius: 8px !important;
  }

  .matrix td.without {
    margin-bottom: 6px;
    border-left: 3px solid var(--bd);
  }

  .matrix td.with {
    border-left: 3px solid var(--acc);
  }
}
</style>
