<script setup lang="ts">
interface CardProps {
  as?: 'article' | 'div' | 'section'
}

withDefaults(defineProps<CardProps>(), { as: 'article' })
</script>

<template>
  <component :is="as" class="card">
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
.card:hover {
  border-color: color-mix(in srgb, var(--acc) 55%, var(--bd));
  box-shadow: var(--shadow-panel-hover);
}

@media (prefers-reduced-motion: reduce) {
  .card { transition: none; }
}
</style>
