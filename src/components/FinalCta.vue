<script setup lang="ts">
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
      <a class="btn primary" :href="repoUrl" target="_blank" rel="noopener noreferrer">Começar no GitHub →</a>
      <a class="btn star" :href="starUrl" target="_blank" rel="noopener noreferrer">⭐ Dar uma estrela</a>
      <a class="btn pink" :href="sponsorUrl" target="_blank" rel="noopener noreferrer">💖 Apoiar</a>
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
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--acc2);
  margin: 0 0 12px;
}

.final h2 {
  font-size: clamp(22px, 3.6vw, 32px);
  margin: 0 0 14px;
}

.final-sub {
  max-width: 560px;
  margin: 0 auto 26px;
  color: var(--mut);
  font-size: 15.5px;
}
</style>
