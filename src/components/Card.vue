<script setup lang="ts">
import { computed } from 'vue'
import { showBrackets, type CardVariant } from '../cardBrackets'

interface CardProps {
  as?: 'article' | 'div' | 'section' | 'aside'
  bracketed?: boolean
  variant?: CardVariant
}

const props = withDefaults(defineProps<CardProps>(), {
  as: 'article',
  bracketed: true,
  variant: 'default',
})

const bracketsVisible = computed(() => showBrackets(props.variant, props.bracketed))
</script>

<template>
  <component :is="as" class="card" :class="[variant, { 'is-bracketed': bracketsVisible }]">
    <span v-if="bracketsVisible" class="card-accent" aria-hidden="true" />
    <slot />
  </component>
</template>

<style scoped>
.card {
  position: relative;
  background: var(--panel);
  border: 1px solid var(--bd);
  clip-path: polygon(var(--cut) 0, 100% 0, 100% calc(100% - var(--cut)), calc(100% - var(--cut)) 100%, 0 100%, 0 var(--cut));
  padding: var(--space-10) var(--space-9) var(--space-9);
  transition: border-color .2s ease, box-shadow .3s ease;
}
.card.is-bracketed {
  border-color: var(--bd-acc);
  box-shadow: var(--shadow-panel-rest);
}
.card:hover {
  border-color: color-mix(in srgb, var(--acc) 55%, var(--bd));
  box-shadow: var(--shadow-panel-hover);
}

.card.star {
  --star-glow-rest: 0 0 0 1px color-mix(in srgb, var(--gold-bright) 45%, transparent), 0 0 70px color-mix(in srgb, var(--gold-bright) 40%, transparent), 0 0 130px color-mix(in srgb, var(--gold-bright) 20%, transparent);
  --star-glow-peak: 0 0 0 1px color-mix(in srgb, var(--gold-bright) 65%, transparent), 0 0 90px color-mix(in srgb, var(--gold-bright) 60%, transparent), 0 0 160px color-mix(in srgb, var(--gold-bright) 32%, transparent);
  clip-path: none;
  border-radius: var(--radius-pill);
  background: linear-gradient(180deg, var(--panel), var(--panel2));
  border-color: color-mix(in srgb, var(--gold-bright) 75%, var(--bd));
  padding: var(--space-11);
  box-shadow: var(--star-glow-rest);
  animation: starcardGlow 3.2s ease-in-out infinite;
}
.card.star:hover {
  border-color: color-mix(in srgb, var(--gold-bright) 85%, var(--bd));
  box-shadow: var(--star-glow-peak);
}

@keyframes starcardGlow {
  0%, 100% { box-shadow: var(--star-glow-rest); }
  50% { box-shadow: var(--star-glow-peak); }
}

.card.is-bracketed::before,
.card.is-bracketed::after {
  content: '';
  position: absolute;
  width: var(--corner-size);
  height: var(--corner-size);
  pointer-events: none;
}
.card.is-bracketed::before {
  top: 0;
  right: 0;
  border-top: var(--corner-w) solid var(--acc);
  border-right: var(--corner-w) solid var(--acc);
}
.card.is-bracketed::after {
  bottom: 0;
  left: 0;
  border-bottom: var(--corner-w) solid var(--acc);
  border-left: var(--corner-w) solid var(--acc);
}

.card-accent {
  position: absolute;
  top: 0;
  left: var(--cut);
  width: var(--accent-bar-w);
  height: var(--accent-bar-h);
  background: var(--acc);
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .card { transition: none; }
}
</style>
