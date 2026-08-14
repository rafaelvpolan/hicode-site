<script setup lang="ts">
import Button from './Button.vue'

interface FinalCtaProps {
  repoUrl: string
  starUrl: string
  sponsorUrl: string
}

defineProps<FinalCtaProps>()
</script>

<template>
  <div class="final">
    <p class="final-eyebrow">CH_08 · PRÓXIMO PASSO</p>
    <h2>Pare de promptar. Comece a desenhar loops.</h2>
    <p class="final-sub">
      hiignation é grátis e aberto. Clone o repo, suba o heartbeat e deixe o primeiro
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
    radial-gradient(720px 320px at 50% 0%, color-mix(in srgb, var(--acc) 14%, transparent) 0%, transparent 60%),
    var(--panel);
  border: 1px solid var(--bd);
  clip-path: polygon(var(--cut) 0, 100% 0, 100% calc(100% - var(--cut)), calc(100% - var(--cut)) 100%, 0 100%, 0 var(--cut));
}

.final-eyebrow {
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--acc2);
  margin: 0 0 var(--space-4);
}

.final h2 {
  font-size: clamp(22px, 3.6vw, 32px);
  margin: 0 0 var(--space-5);
}

.final-sub {
  max-width: 560px;
  margin: 0 auto 26px;
  color: var(--mut);
  font-size: 15.5px;
}
</style>
