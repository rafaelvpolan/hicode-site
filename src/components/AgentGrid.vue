<script setup lang="ts">
import { agents } from '../agents'
import IsoBlock from './IsoBlock.vue'
</script>

<template>
  <ul class="agents">
    <li v-for="agent in agents" :key="agent.id" class="agent" :class="{ 'is-gate': agent.gate }">
      <IsoBlock v-if="agent.gate" class="gate-block" aria-hidden="true">⚖️</IsoBlock>
      <span class="agent-id">{{ agent.id }}</span>
      <span v-if="agent.gate" class="agent-gate">gate</span>
      <span class="agent-domain">{{ agent.domain }}</span>
    </li>
  </ul>
</template>

<style scoped>
.agents {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: var(--space-3);
}

.agent {
  position: relative;
  background: var(--panel);
  border: 1px solid var(--bd);
  border-left: 3px solid var(--acc);
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
  padding: 12px 14px 13px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: box-shadow .3s ease, transform var(--dur-soft) var(--ease-soft), border-color var(--dur-micro) ease;
}

.agent::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: var(--grid-cell) var(--grid-cell);
  opacity: 0;
  transition: opacity var(--dur-soft) ease;
  pointer-events: none;
}

.agent:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--acc) 45%, var(--bd));
  box-shadow: -4px 0 20px -10px color-mix(in srgb, var(--acc) 65%, transparent);
}

.agent:hover::before {
  opacity: 1;
}

.agent > * {
  position: relative;
}

@media (prefers-reduced-motion: reduce) {
  .agent {
    transition: none;
  }
}

.agent-id {
  font-family: var(--font-mono);
  font-size: var(--fs-md);
  font-weight: var(--fw-700);
  color: var(--acc2);
}

.agent-domain {
  color: var(--mut);
  font-size: 12.5px;
  line-height: 1.45;
}

.agent.is-gate {
  --iso-accent: var(--hazard);
  border-left-color: var(--hazard);
  background: color-mix(in srgb, var(--hazard) 7%, var(--panel));
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: auto auto 1fr;
  grid-template-areas: 'block id gate' 'block domain domain';
  align-items: center;
  column-gap: var(--space-5);
}

.agent.is-gate:hover {
  --iso-hover: 1;
}

.gate-block {
  grid-area: block;
  font-size: var(--fs-2xl);
}

.agent.is-gate .agent-id {
  grid-area: id;
  color: var(--hazard);
}

.agent.is-gate .agent-domain {
  grid-area: domain;
}

.agent-gate {
  grid-area: gate;
  align-self: center;
  justify-self: start;
  font-family: var(--font-mono);
  font-size: var(--fs-2xs);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--hazard);
  border: 1px solid color-mix(in srgb, var(--hazard) 45%, transparent);
  border-radius: var(--radius-sm);
  padding: 1px 8px;
}

@media (max-width: 480px) {
  .agents {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
