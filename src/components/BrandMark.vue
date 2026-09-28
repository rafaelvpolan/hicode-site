<script setup lang="ts">
interface BrandMarkProps {
  size?: string
}

const props = withDefaults(defineProps<BrandMarkProps>(), { size: undefined })
</script>

<template>
  <svg
    class="brand-mark"
    :style="props.size ? { width: props.size, height: props.size } : undefined"
    viewBox="0 0 32 32"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <g class="brand-mark-ink">
      <rect x="4" y="9" width="6" height="6" />
      <path d="M5.4 12L7 13.8L8.8 10.2" />
      <rect x="4" y="17" width="6" height="6" />
      <rect x="4" y="25" width="6" height="6" />
      <line x1="13" y1="12" x2="27" y2="12" />
      <line x1="13" y1="20" x2="24" y2="20" />
      <line x1="13" y1="28" x2="22" y2="28" />
    </g>
    <path
      class="brand-mark-spark"
      d="M25 2L26.3 5.4L29.5 6.7L26.3 8L25 11.4L23.7 8L20.5 6.7L23.7 5.4Z"
    />
  </svg>
</template>

<style scoped>
.brand-mark {
  width: var(--brand-mark);
  height: var(--brand-mark);
  flex: 0 0 auto;
  overflow: visible;
}

.brand-mark-ink {
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: square;
  stroke-linejoin: miter;
  fill: none;
}

.brand-mark-spark {
  fill: var(--ok);
  stroke: none;
}
</style>
