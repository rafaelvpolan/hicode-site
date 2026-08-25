import type { CSSProperties } from 'vue'

export interface PipelineStep {
  k: string
  d: string
  icon: string
  color: string
}

export const pipeline: PipelineStep[] = [
  { k: 'Executar', d: 'a tarefa vira um resultado funcional mínimo', icon: '⚡', color: '#2f81f7' },
  { k: 'Preview', d: 'você vê a página rodando antes de qualquer teste', icon: '👁️', color: '#4ea3ff' },
  { k: 'Aprovar', d: 'confirma que é o resultado certo', icon: '✅', color: '#56d6ff' },
  { k: 'Polir', d: 'arquitetura, testes, segurança, review, limpeza', icon: '✨', color: '#7cbcff' },
  { k: 'PR', d: 'a única porta humana: você revisa e dá merge', icon: '🔀', color: '#9fe4ff' },
  { k: 'Deploy', d: 'CI publica e verifica o resultado', icon: '🚀', color: '#38c6f4' },
]

export function stepStyle(step: PipelineStep): CSSProperties {
  return {
    background: `color-mix(in srgb, ${step.color} 18%, transparent)`,
    color: step.color,
    borderColor: `color-mix(in srgb, ${step.color} 40%, transparent)`,
  }
}
