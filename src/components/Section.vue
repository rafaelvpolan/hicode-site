<script setup lang="ts">
interface SectionProps {
  alt?: boolean
}

withDefaults(defineProps<SectionProps>(), { alt: false })
</script>

<template>
  <section class="block" :class="{ alt }">
    <slot />
  </section>
</template>

<style scoped>
.block { padding: clamp(48px, 9vw, 88px) 0; }
.block.alt {
  background: var(--bg2);
  border-top: 1px solid color-mix(in srgb, var(--acc) 30%, var(--bd));
  border-bottom: 1px solid color-mix(in srgb, var(--acc) 30%, var(--bd));
}
</style>
