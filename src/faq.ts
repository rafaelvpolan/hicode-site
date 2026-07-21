export interface FaqItem {
  q: string
  a: string
}

export const faq: FaqItem[] = [
  {
    q: 'O motor faz merge sozinho?',
    a: 'Não. O fluxo automatizado termina em PR aberto e para ali. Merge é sempre humano — mesmo que peçam para o agente mergear, ele deixa o PR pronto e aponta o link.',
  },
  {
    q: 'Toda mudança precisa de uma spec antes?',
    a: 'Não. Spec é reservada para mudança grande, cross-cutting ou com breaking change. Fix e ajuste pequeno nascem direto, sem burocracia.',
  },
  {
    q: 'Como o pipeline decide o que testar em cada card?',
    a: 'Um analisador determinístico lê a natureza da tarefa: mudança cosmética pula arquitetura, testes e segurança; mudança de backend, dados ou risco alto mantém o pipeline inteiro.',
  },
  {
    q: 'O que acontece se eu rejeitar um preview?',
    a: 'O card volta ao estado Executar com o motivo da rejeição anexado, e o motor tenta de novo a partir dali — sem perder o que já funcionava.',
  },
  {
    q: 'É open source de verdade?',
    a: 'Sim. Licença MIT, código público, sem camada paga escondida.',
  },
]
