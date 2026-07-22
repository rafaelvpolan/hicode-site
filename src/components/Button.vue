<script setup lang="ts">
interface ButtonProps {
  variant?: 'default' | 'primary' | 'pink' | 'star'
  size?: 'md' | 'sm'
  href?: string
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'default',
  size: 'md',
  href: undefined,
  type: 'button',
})
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    class="btn"
    :class="[variant, { sm: size === 'sm' }]"
    :href="href"
    :type="href ? undefined : props.type"
  >
    <slot />
  </component>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: .04em;
  line-height: 1.6;
  background: var(--panel2);
  border: 1px solid var(--bd);
  color: var(--tx);
  padding: 11px var(--space-7);
  clip-path: polygon(9px 0, 100% 0, 100% calc(100% - 9px), calc(100% - 9px) 100%, 0 100%, 0 9px);
  font-weight: var(--fw-700);
  font-size: var(--fs-base);
  cursor: pointer;
  transition: transform .06s ease, border-color .15s ease;
}
.btn:hover { text-decoration: none; border-color: var(--acc); transform: translateY(-1px); }
.btn.primary { background: linear-gradient(180deg, var(--acc2), var(--acc)); border-color: var(--acc); color: var(--ink-acc); }
.btn.primary:hover { filter: brightness(1.08); }
.btn.pink { border-color: color-mix(in srgb, var(--pink) 55%, transparent); color: var(--pink-soft); }
.btn.pink:hover { border-color: var(--pink); }
.btn.star {
  background: linear-gradient(180deg, var(--gold-bright2), var(--gold-bright));
  border-color: var(--gold-bright);
  color: var(--ink-star);
}
.btn.star:hover { border-color: var(--gold-soft); }
.btn.sm { padding: var(--space-2) var(--space-5); font-size: var(--fs-md); }
</style>
