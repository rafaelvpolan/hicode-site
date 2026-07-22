<script setup lang="ts">
interface ContainerProps {
  as?: 'div' | 'header' | 'footer' | 'section' | 'main'
}

withDefaults(defineProps<ContainerProps>(), { as: 'div' })
</script>

<template>
  <component :is="as" class="wrap">
    <slot />
  </component>
</template>

<style scoped>
.wrap {
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 0 var(--space-8);
  width: 100%;
}
</style>
