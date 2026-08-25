<script setup lang="ts">
import { repoUrl, sponsorUrl, starUrl } from '../lib/github'
import Button from './Button.vue'
</script>

<template>
  <div class="final">
    <p class="final-eyebrow">CH_09 · PRÓXIMO PASSO</p>
    <h2>Pare de promptar. Comece a desenhar loops.</h2>
    <p class="final-sub">
      hicode é grátis e aberto. Clone o repo, suba o heartbeat e deixe o primeiro
      card virar preview, depois PR — sem precisar reexplicar nada na próxima sessão.
    </p>
    <div class="cta">
      <Button variant="primary" :href="repoUrl" target="_blank" rel="noopener noreferrer">Começar no GitHub →</Button>
      <Button variant="star" :href="starUrl" target="_blank" rel="noopener noreferrer">⭐ Dar uma estrela</Button>
      <Button variant="pink" :href="sponsorUrl" target="_blank" rel="noopener noreferrer">💖 Apoiar</Button>
    </div>
  </div>
</template>

<style scoped>
.final {
  text-align: center;
  padding: clamp(40px, 7vw, 64px) clamp(20px, 5vw, 56px);
  background:
    radial-gradient(720px 320px at 50% 0%, color-mix(in srgb, var(--acc) 20%, transparent) 0%, transparent 60%),
    var(--panel-deep);
  border: 1px solid var(--bd-acc);
  clip-path: polygon(var(--notch) 0, 100% 0, 100% calc(100% - var(--notch)), calc(100% - var(--notch)) 100%, 0 100%, 0 var(--notch));
}

.final .cta { justify-content: center; }

.final-eyebrow {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--acc2);
  margin: 0 0 var(--space-4);
}

.final h2 {
  font-family: var(--font-display);
  font-size: clamp(22px, 3.6vw, 34px);
  font-weight: var(--fw-800);
  letter-spacing: .05em;
  text-transform: uppercase;
  margin: 0 0 var(--space-5);
}

.final-sub {
  max-width: 560px;
  margin: 0 auto 26px;
  color: var(--mut);
  font-size: 15.5px;
}
</style>
