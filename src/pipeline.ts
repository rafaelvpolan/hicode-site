import type { CSSProperties } from 'vue'

export interface PipelineStep {
  k: string
  d: string
  icon: string
  color: string
}

export const pipeline: PipelineStep[] = [
  { k: 'Executar', d: 'a tarefa vira um resultado funcional mínimo', icon: '⚡', color: '#f5a623' },
  { k: 'Preview', d: 'você vê a página rodando antes de qualquer teste', icon: '👁️', color: '#58a6ff' },
  { k: 'Aprovar', d: 'confirma que é o resultado certo', icon: '✅', color: '#3fb950' },
  { k: 'Polir', d: 'arquitetura, testes, segurança, review, limpeza', icon: '✨', color: '#bc8cff' },
  { k: 'PR', d: 'a única porta humana: você revisa e dá merge', icon: '🔀', color: '#f778ba' },
  { k: 'Deploy', d: 'CI publica e verifica o resultado', icon: '🚀', color: '#39c5cf' },
]

export function stepStyle(step: PipelineStep): CSSProperties {
  return {
    background: `color-mix(in srgb, ${step.color} 18%, transparent)`,
    color: step.color,
    borderColor: `color-mix(in srgb, ${step.color} 40%, transparent)`,
  }
}
