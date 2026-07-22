<script setup lang="ts">
interface CardProps {
  as?: 'article' | 'div' | 'section' | 'aside'
  bracketed?: boolean
}

withDefaults(defineProps<CardProps>(), { as: 'article', bracketed: true })
</script>

<template>
  <component :is="as" class="card" :class="{ 'is-bracketed': bracketed }">
    <span v-if="bracketed" class="card-accent" aria-hidden="true" />
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
