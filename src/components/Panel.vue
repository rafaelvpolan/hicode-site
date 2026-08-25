<script setup lang="ts">
interface PanelProps {
  tag?: string
  title: string
  meta?: string
  as?: 'section' | 'div' | 'article' | 'aside'
  headingLevel?: 'h2' | 'h3'
}

withDefaults(defineProps<PanelProps>(), {
  tag: undefined,
  meta: undefined,
  as: 'section',
  headingLevel: 'h2',
})
</script>

<template>
  <component :is="as" class="panel">
    <span class="panel-frame" aria-hidden="true" />
    <header class="panel-head">
      <span class="panel-mark" aria-hidden="true" />
      <span v-if="tag" class="panel-tag">{{ tag }}</span>
      <component :is="headingLevel" class="panel-title">{{ title }}</component>
      <span v-if="meta" class="panel-meta">{{ meta }}</span>
    </header>
    <div class="panel-body">
      <slot />
    </div>
  </component>
</template>

<style scoped>
.panel {
  position: relative;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--acc) 5%, var(--panel-deep)) 0%, var(--panel-deep) 42%);
  border: 1px solid var(--bd);
  box-shadow: var(--shadow-panel-rest);
  padding: 0 0 var(--space-11);
  min-width: 0;
  transition: border-color .2s ease, box-shadow .3s ease;
}
.panel:hover {
  border-color: var(--bd-acc);
  box-shadow: var(--shadow-panel-hover);
}

/* cantos em L: quatro marcas, duas no elemento e duas na moldura decorativa */
.panel::before,
.panel::after,
.panel-frame::before,
.panel-frame::after {
  content: '';
  position: absolute;
  width: var(--corner-size);
  height: var(--corner-size);
  border-color: var(--acc);
  pointer-events: none;
}
.panel::before { top: -1px; left: -1px; border-top: var(--corner-w) solid; border-left: var(--corner-w) solid; }
.panel::after { top: -1px; right: -1px; border-top: var(--corner-w) solid; border-right: var(--corner-w) solid; }
.panel-frame { position: absolute; inset: 0; pointer-events: none; }
.panel-frame::before { bottom: -1px; left: -1px; border-bottom: var(--corner-w) solid; border-left: var(--corner-w) solid; }
.panel-frame::after { bottom: -1px; right: -1px; border-bottom: var(--corner-w) solid; border-right: var(--corner-w) solid; }

.panel-head {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-height: var(--panel-head-h);
  margin-bottom: var(--space-10);
  padding: 0 var(--space-8) 0 var(--space-5);
  background: linear-gradient(90deg, color-mix(in srgb, var(--acc) 26%, transparent) 0%, color-mix(in srgb, var(--acc) 6%, transparent) 58%, transparent 100%);
  border-bottom: 1px solid color-mix(in srgb, var(--acc) 28%, var(--bd));
}

.panel-mark {
  flex: 0 0 auto;
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 7px solid var(--acc2);
}

.panel-tag {
  font-family: var(--font-mono);
  font-size: var(--fs-2xs);
  letter-spacing: var(--track-ls);
  color: var(--acc2);
}

.panel-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--fs-h2);
  font-weight: var(--fw-700);
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--tx);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.panel-meta {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: var(--fs-2xs);
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--mut);
  white-space: nowrap;
}

.panel-body { padding: 0 clamp(var(--space-5), 2vw, var(--space-11)); }

@media (max-width: 620px) {
  .panel-meta { display: none; }
  .panel-title { white-space: normal; }
}

@media (prefers-reduced-motion: reduce) {
  .panel { transition: none; }
}
</style>
