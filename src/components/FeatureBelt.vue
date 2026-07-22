<script setup lang="ts">
import { featureBelt } from '../featureBelt'
</script>

<template>
  <ul class="belt">
    <li v-for="item in featureBelt" :key="item.label">
      <span aria-hidden="true">{{ item.icon }}</span>
      {{ item.label }}
    </li>
  </ul>
</template>

<style scoped>
.belt {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-3);
}

.belt li {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--mut);
  background: var(--panel2);
  border: 1px solid var(--bd);
  border-radius: 999px;
  padding: 7px 14px;
}
</style>
