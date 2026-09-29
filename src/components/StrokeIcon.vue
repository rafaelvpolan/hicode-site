<script setup lang="ts">
import type { StrokeIconKey } from '../strokeIcons'

interface StrokeIconProps {
  icon: StrokeIconKey
}

const props = defineProps<StrokeIconProps>()
</script>

<template>
  <svg
    class="stroke-icon"
    viewBox="0 0 32 32"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <g class="stroke-icon-ink">
      <!-- ciclo fechado com seta: o loop que se realimenta -->
      <template v-if="props.icon === 'loop'">
        <path class="stroke-icon-flow" d="M8 13V6h18v18H8v-5" />
        <path d="M5 22L8 19L11 22" />
      </template>

      <!-- nós ligados: agentes de escopo estreito falando entre si -->
      <template v-else-if="props.icon === 'nodes'">
        <path class="stroke-icon-flow" d="M10 7h12" />
        <path class="stroke-icon-flow" d="M7 10L14 22" />
        <path class="stroke-icon-flow" d="M25 10L18 22" />
        <rect x="4" y="4" width="6" height="6" />
        <rect x="22" y="4" width="6" height="6" />
        <rect x="13" y="22" width="6" height="6" />
      </template>

      <!-- play dentro de um preview: executa antes, mostra antes -->
      <template v-else-if="props.icon === 'play'">
        <rect class="stroke-icon-flow" x="3" y="7" width="26" height="18" />
        <path class="stroke-icon-flow" d="M3 12h26" />
        <path d="M14 15L21 19L14 23Z" />
      </template>

      <!-- raio: a tarefa vira resultado funcional mínimo -->
      <template v-else-if="props.icon === 'run'">
        <path class="stroke-icon-flow" d="M18 2L8 18H15L14 30L24 14H17Z" />
      </template>

      <!-- olho losango: você vê a página rodando -->
      <template v-else-if="props.icon === 'preview'">
        <path class="stroke-icon-flow" d="M3 16L16 7L29 16L16 25Z" />
        <rect x="13" y="13" width="6" height="6" />
      </template>

      <!-- visto dentro da moldura: confirma que é o resultado certo -->
      <template v-else-if="props.icon === 'approve'">
        <rect class="stroke-icon-flow" x="4" y="4" width="24" height="24" />
        <path d="M10 16L14 21L23 11" />
      </template>

      <!-- estrela de polimento: arquitetura, testes, limpeza -->
      <template v-else-if="props.icon === 'polish'">
        <path class="stroke-icon-flow" d="M16 3L19 13L29 16L19 19L16 29L13 19L3 16L13 13Z" />
        <path d="M26 3L27 6L30 7L27 8L26 11L25 8L22 7L25 6Z" />
      </template>

      <!-- dois caminhos que se cruzam: a porta humana do merge -->
      <template v-else-if="props.icon === 'merge'">
        <path class="stroke-icon-flow" d="M3 10H12L21 22H28" />
        <path class="stroke-icon-flow" d="M3 22H12L21 10H28" />
        <path d="M25 7L28 10L25 13" />
        <path d="M25 19L28 22L25 25" />
      </template>

      <!-- foguete: a CI publica e verifica -->
      <template v-else-if="props.icon === 'deploy'">
        <path class="stroke-icon-flow" d="M16 2L22 12V24H10V12Z" />
        <rect x="14" y="11" width="4" height="4" />
        <path d="M10 18L6 25L10 26" />
        <path d="M22 18L26 25L22 26" />
        <path class="stroke-icon-flow" d="M13 26L16 30L19 26" />
      </template>

      <!-- chave fora do alfabeto: cruz visível, nunca um SVG vazio em silêncio -->
      <template v-else>
        <rect x="4" y="4" width="24" height="24" />
        <path d="M4 4L28 28" />
        <path d="M28 4L4 28" />
      </template>
    </g>
  </svg>
</template>

<style scoped>
.stroke-icon {
  width: 1em;
  height: 1em;
  flex: 0 0 auto;
  overflow: visible;
}

.stroke-icon-ink {
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: square;
  stroke-linejoin: miter;
  fill: none;
}

/* o traço que corre: no repouso é tracejado, no hover/foco do card (--iso-hover: 1) avança um ciclo inteiro do padrão */
.stroke-icon-flow {
  stroke-dasharray: 3 3;
  stroke-dashoffset: calc(var(--iso-hover, 0) * var(--iso-flow));
  transition: stroke-dashoffset var(--dur-soft) var(--ease-soft);
}

@media (prefers-reduced-motion: reduce) {
  .stroke-icon-flow {
    transition: none;
  }
}
</style>
