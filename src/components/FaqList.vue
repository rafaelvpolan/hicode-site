<script setup lang="ts">
import { faq } from '../faq'
</script>

<template>
  <div class="faq">
    <details v-for="item in faq" :key="item.q" class="faq-item">
      <summary>
        <span>{{ item.q }}</span>
        <span class="faq-ic" aria-hidden="true">+</span>
      </summary>
      <p>{{ item.a }}</p>
    </details>
  </div>
</template>

<style scoped>
.faq {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.faq-item {
  background: var(--panel);
  border: 1px solid var(--bd);
  clip-path: polygon(var(--cut) 0, 100% 0, 100% calc(100% - var(--cut)), calc(100% - var(--cut)) 100%, 0 100%, 0 var(--cut));
}

.faq-item summary {
  list-style: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  min-height: 44px;
  padding: var(--space-5) var(--space-8);
  font-weight: var(--fw-600);
  color: var(--tx);
}

.faq-item summary::-webkit-details-marker {
  display: none;
}

.faq-ic {
  flex: 0 0 auto;
  font-family: var(--font-mono);
  color: var(--acc2);
  transition: transform 0.15s ease;
}

.faq-item[open] .faq-ic {
  transform: rotate(45deg);
}

.faq-item p {
  margin: 0;
  padding: 0 var(--space-8) var(--space-7);
  color: var(--mut);
  font-size: 14.5px;
}

@media (prefers-reduced-motion: reduce) {
  .faq-ic {
    transition: none;
  }
}
</style>
