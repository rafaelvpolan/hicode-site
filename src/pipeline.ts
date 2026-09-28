import type { CSSProperties } from 'vue'
import type { PhaseIconKey } from './strokeIcons'

export interface PipelineStep {
  k: string
  d: string
  icon: PhaseIconKey
  color: string
}

export const pipeline: PipelineStep[] = [
  { k: 'Executar', d: 'a tarefa vira um resultado funcional mínimo', icon: 'run', color: '#ff6a1a' },
  { k: 'Preview', d: 'você vê a página rodando antes de qualquer teste', icon: 'preview', color: '#ff8f3f' },
  { k: 'Aprovar', d: 'confirma que é o resultado certo', icon: 'approve', color: '#ffb020' },
  { k: 'Polir', d: 'arquitetura, testes, segurança, review, limpeza', icon: 'polish', color: '#ff9e1a' },
  { k: 'PR', d: 'a única porta humana: você revisa e dá merge', icon: 'merge', color: '#ffcf5c' },
  { k: 'Deploy', d: 'CI publica e verifica o resultado', icon: 'deploy', color: '#ff5a2e' },
]

export function stepStyle(step: PipelineStep): CSSProperties {
  return {
    background: `color-mix(in srgb, ${step.color} 18%, transparent)`,
    color: step.color,
    borderColor: `color-mix(in srgb, ${step.color} 40%, transparent)`,
    '--iso-accent': step.color,
  }
}
