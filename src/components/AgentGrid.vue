<script setup lang="ts">
import { agents } from '../agents'
</script>

<template>
  <ul class="agents">
    <li v-for="agent in agents" :key="agent.id" class="agent" :class="{ 'is-gate': agent.gate }">
      <span class="agent-id">{{ agent.id }}</span>
      <span v-if="agent.gate" class="agent-gate">⚖️ gate</span>
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
  transition: box-shadow .3s ease;
}

.agent:hover {
  box-shadow: -4px 0 20px -10px color-mix(in srgb, var(--acc) 65%, transparent);
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
  border-left-color: var(--hazard);
  background: color-mix(in srgb, var(--hazard) 7%, var(--panel));
  grid-column: 1 / -1;
}

.agent.is-gate .agent-id {
  color: var(--hazard);
}

.agent-gate {
  align-self: flex-start;
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
