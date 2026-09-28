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
  background: color-mix(in srgb, var(--acc) 12%, var(--panel2));
  border: 1px solid var(--bd-acc);
  color: var(--tx);
  padding: 11px var(--space-8);
  letter-spacing: .1em;
  clip-path: polygon(var(--cut) 0, 100% 0, 100% calc(100% - var(--cut)), calc(100% - var(--cut)) 100%, 0 100%, 0 var(--cut));
  font-weight: var(--fw-700);
  font-size: var(--fs-md);
  cursor: pointer;
  transition: transform .06s ease, border-color .15s ease, box-shadow .2s ease;
}
.btn:hover { text-decoration: none; border-color: var(--acc); transform: translateY(-1px); box-shadow: 0 0 22px -6px var(--acc); }
.btn.primary { background: linear-gradient(180deg, var(--acc2), var(--acc)); border-color: var(--acc2); color: var(--ink-acc); box-shadow: 0 0 26px -8px var(--acc); }
.btn.primary:hover { filter: brightness(1.08); }
.btn.pink { border-color: color-mix(in srgb, var(--pink) 55%, transparent); color: var(--pink-soft); }
.btn.pink:hover { border-color: var(--pink); }
.btn.star {
  --star-glow-rest: 0 0 0 2px color-mix(in srgb, var(--gold-bright) 75%, transparent), 0 6px 28px color-mix(in srgb, var(--gold-bright) 65%, transparent), 0 0 40px color-mix(in srgb, var(--gold-bright) 35%, transparent);
  --star-glow-peak: 0 0 0 2px color-mix(in srgb, var(--gold-bright) 95%, transparent), 0 6px 34px color-mix(in srgb, var(--gold-bright) 80%, transparent), 0 0 60px color-mix(in srgb, var(--gold-bright) 55%, transparent);
  clip-path: none;
  border-radius: var(--radius-md);
  background: linear-gradient(180deg, var(--gold-bright2), var(--gold-bright));
  border-color: var(--gold-bright);
  color: var(--ink-star);
  box-shadow: var(--star-glow-rest);
  animation: starBtnGlow 2.4s ease-in-out infinite;
}
.btn.star:hover {
  background: linear-gradient(180deg, var(--gold-soft), var(--gold-bright2));
  border-color: var(--gold-bright2);
  box-shadow: 0 0 0 2px var(--gold-bright2), 0 8px 34px color-mix(in srgb, var(--gold-bright) 85%, transparent), 0 0 50px color-mix(in srgb, var(--gold-bright) 50%, transparent);
  animation-play-state: paused;
}
.btn.sm { padding: var(--space-2) var(--space-5); font-size: var(--fs-md); }

@keyframes starBtnGlow {
  0%, 100% { box-shadow: var(--star-glow-rest); }
  50% { box-shadow: var(--star-glow-peak); }
}
</style>
