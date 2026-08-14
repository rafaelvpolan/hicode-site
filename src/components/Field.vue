<script setup lang="ts">
import { useId } from 'vue'

interface FieldProps {
  label: string
  hint?: string
  required?: boolean
}

withDefaults(defineProps<FieldProps>(), {
  hint: undefined,
  required: false,
})

const hintId = `field-hint-${useId()}`
</script>

<template>
  <label class="field">
    <span class="field-label">
      {{ label }}
      <span v-if="required" class="field-req" aria-hidden="true">*</span>
    </span>
    <slot :hint-id="hint ? hintId : undefined" />
    <span v-if="hint" :id="hintId" class="field-hint">{{ hint }}</span>
  </label>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.field-label {
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  font-weight: var(--fw-700);
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--acc2);
}
.field-req { color: var(--acc); }
.field-hint {
  font-size: var(--fs-md);
  color: var(--mut);
}
.field :slotted(input),
.field :slotted(textarea),
.field :slotted(select) {
  width: 100%;
  font-family: var(--font-mono);
  font-size: var(--fs-base);
  color: var(--tx);
  background: var(--panel2);
  border: 1px solid var(--bd);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  transition: border-color .15s ease;
}
.field :slotted(input:focus-visible),
.field :slotted(textarea:focus-visible),
.field :slotted(select:focus-visible) {
  outline: 2px solid var(--acc2);
  outline-offset: 2px;
  border-color: var(--acc);
}
</style>
