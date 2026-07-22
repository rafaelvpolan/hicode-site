<script setup lang="ts">
interface ThrottleGaugeProps {
  rpm: number
  rpmFraction: number
  statusLabel: string
  isRunning: boolean
}

defineProps<ThrottleGaugeProps>()
</script>

<template>
  <div class="throttle" :style="{ '--throttle-frac': rpmFraction }" aria-hidden="true">
    <div class="throttle-track">
      <div class="throttle-fill"></div>
      <span class="throttle-embers" :class="{ 'is-running': isRunning }">
        <i></i><i></i><i></i>
      </span>
    </div>
    <div class="throttle-readout">
      <span class="throttle-k">RPM</span>
      <span class="throttle-v">{{ rpm }}</span>
      <span class="throttle-status">{{ statusLabel }}</span>
    </div>
  </div>
</template>

<style scoped>
.throttle {
  flex: 1 1 auto;
  min-width: 180px;
}

.throttle-track {
  position: relative;
  height: 14px;
  background: var(--bg2);
  border: 1px solid var(--bd);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.throttle-fill {
  position: absolute;
  inset: 0;
  width: calc(var(--throttle-frac, 0) * 100%);
  background: linear-gradient(90deg, var(--acc), var(--hazard) 70%, var(--gold-bright));
  box-shadow: 0 0 14px color-mix(in srgb, var(--acc) 65%, transparent);
  transition: width 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.throttle-embers {
  position: absolute;
  inset: 0;
  right: calc((1 - var(--throttle-frac, 0)) * 100%);
}

.throttle-embers i {
  position: absolute;
  top: -4px;
  right: 0;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--gold-bright);
  box-shadow: 0 0 6px var(--gold-bright);
  opacity: 0;
}

.throttle-embers.is-running i {
  animation: throttleEmberRise 1.8s ease-in infinite;
}

.throttle-embers i:nth-child(2) {
  top: 4px;
  animation-delay: 0.3s;
}

.throttle-embers i:nth-child(3) {
  top: 10px;
  animation-delay: 0.6s;
}

@keyframes throttleEmberRise {
  0% {
    opacity: 0;
    transform: translate(0, 0) scale(0.6);
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(10px, -16px) scale(1.1);
  }
}

.throttle-readout {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  margin-top: var(--space-2);
  font-family: var(--font-mono);
}

.throttle-k {
  font-size: var(--fs-2xs);
  letter-spacing: 0.18em;
  color: var(--mut);
}

.throttle-v {
  font-size: 20px;
  font-weight: var(--fw-800);
  color: var(--tx);
  font-variant-numeric: tabular-nums;
}

.throttle-status {
  font-size: var(--fs-xs);
  letter-spacing: 0.08em;
  color: var(--acc2);
  margin-left: auto;
}

@media (prefers-reduced-motion: reduce) {
  .throttle-fill {
    transition: none;
  }
  .throttle-embers.is-running i {
    animation: none;
    opacity: 0;
  }
}
</style>
