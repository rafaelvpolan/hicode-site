export type PillarIconKey = 'loop' | 'nodes' | 'play'

export interface Pillar {
  icon: PillarIconKey
  title: string
  text: string
}

export const pillars: Pillar[] = [
  {
    icon: 'loop',
    title: 'Loop Engineering',
    text: 'Você para de promptar o agente e passa a desenhar o loop que o prompta. O estado vive em disco: o agente esquece, o repo lembra.',
  },
  {
    icon: 'nodes',
    title: 'Agentes Nexus',
    text: '15 agentes de escopo estreito (código, testes, segurança, banco, frontend…) e um gate adversarial, o Crivo, que aprova ou bloqueia o trabalho.',
  },
  {
    icon: 'play',
    title: 'Executar primeiro',
    text: 'Primeiro a tarefa funciona e você vê o preview; só depois vêm arquitetura, testes e limpeza. Valida-se a intenção cedo.',
  },
]
