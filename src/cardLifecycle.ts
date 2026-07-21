export type CardLifecycleActor = 'motor' | 'humano'

export interface CardLifecycleStage {
  id: string
  actor: CardLifecycleActor
  label: string
  detail: string
}

export const cardLifecycle: CardLifecycleStage[] = [
  {
    id: 'EXECUTED',
    actor: 'motor',
    label: 'Executar',
    detail: 'A tarefa vira um resultado funcional mínimo, sem polir — a intenção acima da forma.',
  },
  {
    id: 'PREVIEW',
    actor: 'motor',
    label: 'Preview',
    detail: 'O app sobe no worktree do card: URL viva e screenshot aparecem no dashboard.',
  },
  {
    id: 'PREVIEW_OK',
    actor: 'humano',
    label: 'Aprovar preview',
    detail: 'Você confirma que é o resultado certo. Rejeitar volta o card para Executar com o motivo.',
  },
  {
    id: 'REFINED',
    actor: 'motor',
    label: 'Refinar',
    detail: 'Só agora a arquitetura é melhorada: composição, nomes, responsabilidades.',
  },
  {
    id: 'TESTS_GREEN',
    actor: 'motor',
    label: 'Testes',
    detail: 'Testes, lint e typecheck rodam de verdade — o loop fecha lendo exit code em disco.',
  },
  {
    id: 'SEC_CLEARED',
    actor: 'motor',
    label: 'Segurança',
    detail: 'Auditoria de segurança quando a mudança tem risco real — nunca pulada em código sensível.',
  },
  {
    id: 'REVIEWED',
    actor: 'motor',
    label: 'Crivo',
    detail: 'O gate adversarial audita o diff e bloqueia o que não passa — sem complacência.',
  },
  {
    id: 'CLEANED',
    actor: 'motor',
    label: 'Limpar',
    detail: 'Comentários redundantes e código morto saem antes de qualquer PR.',
  },
  {
    id: 'PR_OPEN',
    actor: 'motor',
    label: 'Abrir PR',
    detail: 'O motor abre o PR e para. Nunca dá merge — nem se pedirem.',
  },
  {
    id: 'MERGE',
    actor: 'humano',
    label: 'Merge',
    detail: 'A única porta obrigatória do fluxo. Você revisa o diff e decide.',
  },
]
