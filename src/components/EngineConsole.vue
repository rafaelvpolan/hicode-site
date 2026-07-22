<script setup lang="ts">
import { useIgnition } from '../useIgnition'
import { useProcessFeed } from '../useProcessFeed'
import ThrottleGauge from './ThrottleGauge.vue'
import ProcessFeed from './ProcessFeed.vue'

const {
  displayRpm,
  rpmFraction,
  isRunning,
  isCranking,
  statusLabel,
  buttonLabel,
  srStatusLabel,
  toggle,
} = useIgnition()

const { tasks } = useProcessFeed({ isRunning, rpmFraction })
</script>

<template>
  <div class="engine" :class="{ 'is-cranking': isCranking, 'is-running': isRunning }">
    <div class="engine-head">
      <button
        type="button"
        class="ignite-btn"
        :class="{ 'is-on': isRunning || isCranking }"
        :aria-pressed="isRunning || isCranking"
        aria-describedby="engine-status"
        @click="toggle"
      >{{ buttonLabel }}</button>
      <ThrottleGauge :rpm="displayRpm" :rpm-fraction="rpmFraction" :status-label="statusLabel" :is-running="isRunning" />
    </div>
    <ProcessFeed :tasks="tasks" :is-running="isRunning" />
    <p id="engine-status" class="sr-only" role="status" aria-live="polite">{{ srStatusLabel }}</p>
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

.engine {
  position: relative;
  margin: clamp(36px, 6vw, 56px) auto 0;
  width: 100%;
  max-width: 540px;
  text-align: left;
  background: var(--panel);
  border: 1px solid var(--bd);
  clip-path: polygon(var(--cut) 0, 100% 0, 100% calc(100% - var(--cut)), calc(100% - var(--cut)) 100%, 0 100%, 0 var(--cut));
  padding: 20px 22px 18px;
  transition: border-color 0.4s ease, box-shadow 0.4s ease;
}

.engine.is-running {
  border-color: color-mix(in srgb, var(--acc) 55%, var(--bd));
  box-shadow: var(--shadow-panel-active);
}

.engine-head {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}

.ignite-btn {
  flex: 0 0 auto;
  font-family: var(--font-mono);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 13px;
  color: var(--tx);
  background: var(--panel2);
  border: 1px solid var(--bd);
  padding: 13px 24px;
  min-height: 44px;
  min-width: 44px;
  cursor: pointer;
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
  transition: border-color 0.15s ease, color 0.15s ease, background 0.2s ease, transform 0.06s ease, box-shadow 0.4s ease;
}

.ignite-btn:hover {
  border-color: var(--acc);
  transform: translateY(-1px);
}

.ignite-btn.is-on {
  background: linear-gradient(180deg, var(--acc2), var(--acc));
  color: var(--ink-acc);
  border-color: var(--acc);
}

.engine.is-cranking .ignite-btn,
.engine.is-running .ignite-btn {
  animation: igniteGlow 2s ease-in-out infinite;
}

@keyframes igniteGlow {
  0%,
  100% {
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--acc) 55%, transparent), 0 0 22px color-mix(in srgb, var(--acc) 40%, transparent);
  }
  50% {
    box-shadow: 0 0 0 1px var(--acc), 0 0 38px color-mix(in srgb, var(--acc) 70%, transparent);
  }
}

@media (max-width: 520px) {
  .engine-head {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (prefers-reduced-motion: reduce) {
  .engine,
  .ignite-btn {
    transition: none;
  }
  .engine.is-cranking .ignite-btn,
  .engine.is-running .ignite-btn {
    animation: none;
  }
}
</style>
