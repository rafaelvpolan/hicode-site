export interface PromptVsLoopRow {
  without: string
  with: string
}

export const promptVsLoop: PromptVsLoopRow[] = [
  { without: 'Você reescreve o mesmo prompt a cada sessão', with: 'O card guarda a intenção — o loop retoma sozinho' },
  { without: 'O agente esquece o que já tentou', with: 'Tentativas e custo ficam em disco, entre execuções' },
  { without: 'Um agente genérico faz tudo, sem foco', with: '15 agentes de escopo estreito, cada um no seu domínio' },
  { without: 'Você revisa o diff inteiro, sozinho', with: 'Um gate adversarial audita antes de chegar até você' },
  { without: 'Testar e limpar competem com entregar rápido', with: 'Executa e mostra primeiro; polir vem só depois' },
  { without: 'Merge automático é uma aposta de confiança', with: 'Merge é sempre humano — sem exceção' },
]
