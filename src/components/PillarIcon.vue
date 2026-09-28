<script setup lang="ts">
import type { PillarIconKey } from '../pillars'

interface PillarIconProps {
  icon: PillarIconKey
}

const props = defineProps<PillarIconProps>()
</script>

<template>
  <svg
    class="pillar-icon"
    viewBox="0 0 32 32"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <g class="pillar-icon-ink">
      <!-- ciclo fechado com seta: o loop que se realimenta -->
      <template v-if="props.icon === 'loop'">
        <path class="pillar-icon-flow" d="M8 13V6h18v18H8v-5" />
        <path d="M5 22L8 19L11 22" />
      </template>

      <!-- nós ligados: agentes de escopo estreito falando entre si -->
      <template v-else-if="props.icon === 'nodes'">
        <path class="pillar-icon-flow" d="M10 7h12" />
        <path class="pillar-icon-flow" d="M7 10L14 22" />
        <path class="pillar-icon-flow" d="M25 10L18 22" />
        <rect x="4" y="4" width="6" height="6" />
        <rect x="22" y="4" width="6" height="6" />
        <rect x="13" y="22" width="6" height="6" />
      </template>

      <!-- play dentro de um preview: executa antes, mostra antes -->
      <template v-else-if="props.icon === 'play'">
        <rect class="pillar-icon-flow" x="3" y="7" width="26" height="18" />
        <path class="pillar-icon-flow" d="M3 12h26" />
        <path d="M14 15L21 19L14 23Z" />
      </template>
    </g>
  </svg>
</template>

<style scoped>
.pillar-icon {
  width: 1em;
  height: 1em;
  flex: 0 0 auto;
  overflow: visible;
}

.pillar-icon-ink {
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: square;
  stroke-linejoin: miter;
  fill: none;
}

/* o traço que corre: no repouso é tracejado, no hover do card (--iso-hover: 1) avança um ciclo inteiro do padrão */
.pillar-icon-flow {
  stroke-dasharray: 3 3;
  stroke-dashoffset: calc(var(--iso-hover, 0) * -12);
  transition: stroke-dashoffset var(--dur-soft) var(--ease-soft);
}

@media (prefers-reduced-motion: reduce) {
  .pillar-icon-flow {
    transition: none;
  }
}
</style>
