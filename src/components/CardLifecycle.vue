<script setup lang="ts">
import { cardLifecycle } from '../cardLifecycle'
import type { CardLifecycleActor } from '../cardLifecycle'

function stageColor(actor: CardLifecycleActor): string {
  return actor === 'humano' ? 'var(--hazard)' : 'var(--acc)'
}
</script>

<template>
  <ol class="lifecycle">
    <li v-for="(stage, i) in cardLifecycle" :key="stage.id" :style="{ '--stage-c': stageColor(stage.actor) }">
      <span class="lc-index" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
      <div class="lc-body">
        <div class="lc-head">
          <span class="lc-id">{{ stage.id }}</span>
          <span class="lc-actor" :class="stage.actor">{{ stage.actor }}</span>
        </div>
        <h3>{{ stage.label }}</h3>
        <p>{{ stage.detail }}</p>
      </div>
    </li>
  </ol>
</template>

<style scoped>
.lifecycle {
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-9);
}

.lifecycle::before {
  content: '';
  position: absolute;
  top: 6px;
  bottom: 6px;
  left: 15px;
  width: 2px;
  background: linear-gradient(180deg, var(--acc), var(--hazard));
  opacity: 0.35;
}

.lifecycle li {
  position: relative;
  display: flex;
  gap: var(--space-7);
  padding-left: 0;
}

.lc-index {
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  font-weight: var(--fw-700);
  color: var(--stage-c, var(--acc));
  background: var(--panel);
  border: 2px solid var(--stage-c, var(--acc));
  z-index: 1;
}

.lc-body {
  flex: 1 1 auto;
  min-width: 0;
  background: var(--panel);
  border: 1px solid var(--bd);
  border-left: 3px solid var(--stage-c, var(--acc));
  clip-path: polygon(var(--cut) 0, 100% 0, 100% calc(100% - var(--cut)), calc(100% - var(--cut)) 100%, 0 100%, 0 var(--cut));
  padding: var(--space-5) var(--space-7) var(--space-6);
}

.lc-head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
  margin-bottom: var(--space-1);
}

.lc-id {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  letter-spacing: 0.1em;
  color: var(--stage-c, var(--acc));
}

.lc-actor {
  font-family: var(--font-mono);
  font-size: var(--fs-2xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--bd);
  color: var(--mut);
}

.lc-actor.humano {
  color: var(--hazard);
  border-color: color-mix(in srgb, var(--hazard) 45%, transparent);
  background: color-mix(in srgb, var(--hazard) 12%, transparent);
}

.lc-body h3 {
  margin: 0 0 4px;
  font-size: 16px;
}

.lc-body p {
  margin: 0;
  color: var(--mut);
  font-size: var(--fs-base);
}

@media (max-width: 560px) {
  .lifecycle::before {
    left: 15px;
  }
}
</style>
