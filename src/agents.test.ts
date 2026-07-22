import { describe, expect, it } from 'vitest'
import { agents, type NexusAgent } from './agents'

describe('agents', () => {
  it('agents — catalog — has at least one entry', () => {
    expect(agents.length).toBeGreaterThan(0)
  })

  it('agents — all entries — ids are distinct', () => {
    const ids = agents.map((agent) => agent.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it.each(agents.map((agent): [string, NexusAgent] => [agent.id, agent]))(
    'agents — entry %s — has a non-empty domain description',
    (_id, agent) => {
      expect(agent.domain.length).toBeGreaterThan(0)
    },
  )

  it('agents — gated entries — exactly one agent is marked as gate', () => {
    const gateAgents = agents.filter((agent) => agent.gate === true)
    expect(gateAgents).toHaveLength(1)
  })

  it('agents — gated entry — is crivo', () => {
    const gateAgents = agents.filter((agent) => agent.gate === true)
    expect(gateAgents[0]?.id).toBe('crivo')
  })
})
