export interface NexusAgent {
  id: string
  domain: string
  gate?: boolean
}

export const agents: NexusAgent[] = [
  { id: 'limpio', domain: 'Implementa, revisa e refatora features com escopo definido' },
  { id: 'rufus', domain: 'Refatoração segura — muda a forma, nunca o comportamento' },
  { id: 'pluto', domain: 'Sinaliza código morto (nunca remove sem confirmação)' },
  { id: 'testudo', domain: 'Escreve testes, mede cobertura e mutation score' },
  { id: 'escudo', domain: 'Segurança: auth, secrets, CVEs e IaC' },
  { id: 'radix', domain: 'Banco de dados: schema, migrations, índices, queries' },
  { id: 'celer', domain: 'Performance: profiling e otimização com medição' },
  { id: 'vitro', domain: 'Frontend de produto: Vue, React, React Native, Solid' },
  { id: 'frontiteto', domain: 'Estrutura e design system do frontend (gated, antes do Crivo)' },
  { id: 'continuum', domain: 'CI/CD e IaC — gera pipelines e infra, nunca aplica deploy' },
  { id: 'corvinus', domain: 'Observabilidade: logs, métricas, tracing e causa raiz' },
  { id: 'glossia', domain: 'Documentação: specs, ADRs, OpenAPI, diagramas' },
  { id: 'fulgor', domain: 'Apresentações e dashboards em HTML' },
  { id: 'quaero', domain: 'Pesquisa externa: libs, RFCs e trade-offs' },
  { id: 'pura', domain: 'Remove comentários redundantes do código' },
  { id: 'crivo', domain: 'Audita cada entrega de forma adversarial e bloqueia o que não passa', gate: true },
]
