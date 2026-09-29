<script setup lang="ts">
interface IsoBlockProps {
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<IsoBlockProps>(), { size: 'md' })
</script>

<template>
  <span class="iso" :class="`iso-${size}`">
    <span class="iso-rig" aria-hidden="true">
      <span class="iso-glow"></span>
      <span class="iso-slab iso-base"></span>
      <span class="iso-slab iso-mid"></span>
      <span class="iso-slab iso-top"></span>
    </span>
    <span class="iso-cap"><slot /></span>
  </span>
</template>

<style scoped>
.iso {
  --iso-accent: var(--acc);
  --iso-face: color-mix(in srgb, var(--iso-accent) 26%, var(--panel2));
  --iso-face-lo: color-mix(in srgb, var(--iso-accent) 12%, var(--bg2));
  --iso-edge: color-mix(in srgb, var(--iso-accent) 60%, var(--bd));
  /* assento do conteúdo: a face de cima é a .iso-top, em translateZ(--iso-depth * 2);
     inclinada em --iso-tilt, ela aparece na tela --iso-depth * 2 * sin(tilt) acima do centro.
     O conteúdo repousa exatamente aí, em vez de subir um valor arbitrário. */
  --iso-seat: calc(var(--iso-depth) * 2 * sin(var(--iso-tilt)));
  position: relative;
  flex: 0 0 auto;
  display: inline-grid;
  place-items: center;
  width: var(--iso-size);
  height: var(--iso-size);
  perspective: var(--iso-perspective);
  animation: isoFloat var(--iso-float-dur) ease-in-out infinite;
}

/* --iso-hover e intensidade, nao liga-desliga: o card acende 1, e chegar com o mouse no proprio icone passa de 1, entao
   o mesmo calc rende um passo a mais de giro, altura e brilho — e o gesto de mirar o icone tem resposta propria */
.iso:hover { --iso-hover: 1.45; }

.iso-sm { --iso-size: 34px; --iso-depth: 6px; }
.iso-lg { --iso-size: 74px; --iso-depth: 14px; }

.iso-rig {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transform:
    scale(calc(1 + var(--iso-hover, 0) * var(--iso-pop)))
    translateY(calc(var(--iso-hover, 0) * var(--iso-lift) * -1))
    rotateX(var(--iso-tilt))
    rotateZ(calc(var(--iso-spin) + var(--iso-hover, 0) * var(--iso-spin-hover)));
  transition: transform var(--dur-soft) var(--ease-soft);
}

.iso-slab {
  position: absolute;
  border: 1px solid var(--iso-edge);
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--iso-face), var(--iso-face-lo));
}

.iso-base { inset: 8%; transform: translateZ(0); opacity: .45; }
.iso-mid { inset: 18%; transform: translateZ(var(--iso-depth)); opacity: .72; }
.iso-top {
  inset: 28%;
  transform: translateZ(calc(var(--iso-depth) * 2));
  box-shadow: 0 0 20px -2px color-mix(in srgb, var(--iso-accent) 70%, transparent);
}

.iso-glow {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--iso-accent) 55%, transparent), transparent 78%);
  transform: translateZ(calc(var(--iso-depth) * -1)) scale(calc(1 + var(--iso-hover, 0) * var(--iso-glow-pop)));
  transition: transform var(--dur-soft) var(--ease-soft);
  animation: isoGlowPulse var(--iso-float-dur) ease-in-out infinite;
}

.iso-cap {
  position: relative;
  z-index: 1;
  line-height: 1;
  /* mesmo --iso-hover * --iso-lift da .iso-rig: laje e conteúdo sobem juntos, sem se separar */
  transform: translateY(calc((var(--iso-seat) + var(--iso-hover, 0) * var(--iso-lift)) * -1));
  transition: transform var(--dur-soft) var(--ease-soft);
  filter: drop-shadow(0 0 8px color-mix(in srgb, var(--iso-accent) 55%, transparent));
}

@keyframes isoFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

@keyframes isoGlowPulse {
  0%, 100% { opacity: .45; }
  50% { opacity: .85; }
}

@media (prefers-reduced-motion: reduce) {
  .iso,
  .iso-glow {
    animation: none;
  }
  .iso-rig,
  .iso-cap,
  .iso-glow {
    transition: none;
  }
}
</style>
