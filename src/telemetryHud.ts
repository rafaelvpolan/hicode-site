import { agents } from './agents'
import type { NexusAgent } from './agents'
import { cardLifecycle } from './cardLifecycle'
import { pipeline } from './pipeline'
import type { PipelineStep } from './pipeline'

export interface TelemetryGauge {
  id: string
  label: string
  value: number
  color: string
  detail: string
}

const motorCount = cardLifecycle.filter((stage) => stage.actor === 'motor').length
const automationPct = Math.round((motorCount / cardLifecycle.length) * 100)
const previewIndex = cardLifecycle.findIndex((stage) => stage.id === 'PREVIEW')
const untilPreviewPct = Math.round(((previewIndex + 1) / cardLifecycle.length) * 100)

export const telemetryGauges: TelemetryGauge[] = [
  {
    id: 'AUTOMACAO',
    label: 'Automação do loop',
    value: automationPct,
    color: 'var(--acc)',
    detail: `${motorCount} de ${cardLifecycle.length} estados do card rodam sozinhos no motor`,
  },
  {
    id: 'ATE_PREVIEW',
    label: 'Até você ver o resultado',
    value: untilPreviewPct,
    color: 'var(--acc2)',
    detail: `Executar + Preview: os ${previewIndex + 1} primeiros de ${cardLifecycle.length} estados`,
  },
  {
    id: 'GATE',
    label: 'Crivo — gate obrigatório',
    value: 100,
    color: 'var(--hazard)',
    detail: 'Nenhuma entrega passa sem a revisão adversarial',
  },
]

export interface TelemetryPhase extends PipelineStep {
  progress: number
}

export function telemetryPhases(): TelemetryPhase[] {
  return pipeline.map((step, index) => ({
    ...step,
    progress: Math.round(((index + 1) / pipeline.length) * 100),
  }))
}

export const telemetryConnectionIds: string[] = ['vitro', 'frontiteto', 'testudo', 'escudo', 'radix', 'celer', 'crivo']

export function resolveConnections(ids: string[]): NexusAgent[] {
  return ids
    .map((id) => agents.find((agent) => agent.id === id))
    .filter((agent): agent is NexusAgent => agent !== undefined)
}

export interface TelemetryStat {
  value: string
  label: string
}

const gateCount = agents.filter((agent) => agent.gate).length
const specialistCount = agents.filter((agent) => !agent.gate).length

export const telemetryStats: TelemetryStat[] = [
  { value: String(pipeline.length).padStart(2, '0'), label: 'fases no pipeline' },
  { value: String(specialistCount).padStart(2, '0'), label: 'agentes especializados' },
  { value: String(gateCount).padStart(2, '0'), label: 'gate adversarial (Crivo)' },
  { value: String(cardLifecycle.length).padStart(2, '0'), label: 'estados por card' },
]
