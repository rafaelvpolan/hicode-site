<script setup lang="ts">
import { telemetryGauges, telemetryStats, telemetryConnectionIds, resolveConnections, telemetryPhases } from '../telemetryHud'

const connections = resolveConnections(telemetryConnectionIds)
const phases = telemetryPhases()
</script>

<template>
  <div class="hud">
    <div class="hud-grid">
      <div class="gauges" role="list" aria-label="Indicadores do loop">
        <div
          v-for="gauge in telemetryGauges"
          :key="gauge.id"
          class="gauge"
          role="listitem"
          :style="{ '--gauge-frac': gauge.value / 100, '--gauge-color': gauge.color }"
        >
          <div class="gauge-ring">
            <span class="gauge-val">{{ gauge.value }}<small>%</small></span>
          </div>
          <p class="gauge-label">{{ gauge.label }}</p>
          <p class="gauge-detail">{{ gauge.detail }}</p>
        </div>
      </div>

      <div class="phases" role="list" aria-label="Progresso por fase do pipeline">
        <div
          v-for="phase in phases"
          :key="phase.k"
          class="phase-row"
          role="listitem"
          :style="{ '--phase-color': phase.color, '--phase-frac': phase.progress / 100 }"
        >
          <span class="phase-k">{{ phase.k }}</span>
          <div class="phase-track"><div class="phase-fill"></div></div>
          <span class="phase-v">{{ phase.progress }}%</span>
        </div>
      </div>
    </div>

    <div class="hud-lower">
      <ul class="connections" aria-label="Agentes conectados ao loop">
        <li v-for="agent in connections" :key="agent.id" class="conn" :class="{ 'is-gate': agent.gate }">
          <span class="conn-dot" aria-hidden="true"></span>
          <span class="conn-id">{{ agent.id }}</span>
          <span class="conn-status">{{ agent.gate ? 'bloqueia sem revisão' : 'online' }}</span>
        </li>
      </ul>

      <div class="stats" aria-label="Números do loop">
        <div v-for="stat in telemetryStats" :key="stat.label" class="stat">
          <span class="stat-v">{{ stat.value }}</span>
          <span class="stat-l">{{ stat.label }}</span>
        </div>
      </div>
    </div>

    <p class="alert">
      <span class="alert-ic" aria-hidden="true">▲</span>
      <span class="alert-txt">Merge sempre humano</span>
      <span class="alert-sub">nenhum PR chega à produção sem revisão adversarial do Crivo e clique humano</span>
    </p>
  </div>
</template>

<style scoped>
.hud {
  --hud-glow: 0 0 0 1px color-mix(in srgb, var(--acc) 24%, transparent), 0 18px 50px -28px color-mix(in srgb, var(--acc) 60%, transparent);
  background: var(--panel);
  border: 1px solid var(--bd);
  box-shadow: var(--hud-glow);
  clip-path: polygon(var(--cut) 0, 100% 0, 100% calc(100% - var(--cut)), calc(100% - var(--cut)) 100%, 0 100%, 0 var(--cut));
  padding: 26px 26px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hud-grid {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) minmax(260px, 1.3fr);
  gap: 24px;
}

.gauges {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
}

.gauge {
  flex: 1 1 140px;
  text-align: center;
}

.gauge-ring {
  --ring-size: 84px;
  width: var(--ring-size);
  height: var(--ring-size);
  margin: 0 auto 12px;
  border-radius: 50%;
  background: conic-gradient(var(--gauge-color, var(--acc)) calc(var(--gauge-frac, 0) * 360deg), var(--bg2) 0);
  display: grid;
  place-items: center;
  position: relative;
}

.gauge-ring::before {
  content: '';
  position: absolute;
  inset: 8px;
  border-radius: 50%;
  background: var(--panel);
  border: 1px solid var(--bd);
}

.gauge-val {
  position: relative;
  z-index: 1;
  font-family: var(--font-mono);
  font-weight: 800;
  font-size: 20px;
  color: var(--gauge-color, var(--acc));
}

.gauge-val small {
  font-size: 12px;
  font-weight: 600;
  margin-left: 1px;
}

.gauge-label {
  margin: 0 0 4px;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--tx);
}

.gauge-detail {
  margin: 0;
  font-size: 12px;
  color: var(--mut);
}

.phases {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}

.phase-row {
  display: grid;
  grid-template-columns: 74px 1fr 40px;
  align-items: center;
  gap: 10px;
}

.phase-k {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--phase-color, var(--acc));
}

.phase-track {
  position: relative;
  height: 8px;
  background: var(--bg2);
  border: 1px solid var(--bd);
  border-radius: 2px;
  overflow: hidden;
}

.phase-fill {
  position: absolute;
  inset: 0;
  width: calc(var(--phase-frac, 0) * 100%);
  background: var(--phase-color, var(--acc));
  box-shadow: 0 0 10px color-mix(in srgb, var(--phase-color, var(--acc)) 65%, transparent);
}

.phase-v {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--mut);
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.hud-lower {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 24px;
  padding-top: 20px;
  border-top: 1px dashed var(--bd);
}

.connections {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.conn {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 12.5px;
  padding: 7px 10px;
  background: var(--panel2);
  border: 1px solid var(--bd);
  clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
}

.conn-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--acc);
  box-shadow: 0 0 6px var(--acc);
}

.conn-id {
  color: var(--tx);
  text-transform: lowercase;
}

.conn-status {
  color: var(--mut);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.conn.is-gate {
  border-color: color-mix(in srgb, var(--hazard) 55%, var(--bd));
  background: color-mix(in srgb, var(--hazard) 10%, var(--panel2));
}

.conn.is-gate .conn-dot {
  background: var(--hazard);
  box-shadow: 0 0 8px var(--hazard);
}

.conn.is-gate .conn-id,
.conn.is-gate .conn-status {
  color: var(--hazard);
  font-weight: 700;
}

.stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.stat {
  text-align: center;
  background: var(--bg2);
  border: 1px solid var(--bd);
  padding: 12px 8px 10px;
}

.stat-v {
  display: block;
  font-family: var(--font-mono);
  font-size: 22px;
  font-weight: 800;
  color: var(--acc2);
}

.stat-l {
  display: block;
  margin-top: 2px;
  font-size: 11px;
  color: var(--mut);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.alert {
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
  margin: 0;
  padding: 14px 18px;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: color-mix(in srgb, var(--hazard) 14%, var(--bg2));
  border: 1px solid color-mix(in srgb, var(--hazard) 55%, var(--bd));
  color: var(--hazard);
  animation: hudAlertPulse 2.6s ease-in-out infinite;
}

.alert-ic {
  font-size: 14px;
}

.alert-txt {
  font-weight: 800;
  font-size: 14px;
}

.alert-sub {
  color: color-mix(in srgb, var(--hazard) 75%, var(--tx));
  font-weight: 500;
  font-size: 11.5px;
  letter-spacing: 0.03em;
  text-transform: none;
}

@keyframes hudAlertPulse {
  0%,
  100% {
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--hazard) 45%, transparent);
  }
  50% {
    box-shadow: 0 0 0 1px var(--hazard), 0 0 26px color-mix(in srgb, var(--hazard) 55%, transparent);
  }
}

@media (max-width: 760px) {
  .hud-grid {
    grid-template-columns: 1fr;
  }
  .hud-lower {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .alert {
    animation: none;
  }
}
</style>
