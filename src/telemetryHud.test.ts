import { describe, expect, it } from 'vitest'
import {
  resolveConnections,
  telemetryConnectionIds,
  telemetryGauges,
  telemetryPhases,
  telemetryStats,
} from './telemetryHud'
import { agents } from './agents'
import { cardLifecycle } from './cardLifecycle'
import { pipeline } from './pipeline'

describe('telemetryPhases', () => {
  it('telemetryPhases — called — returns one phase per pipeline step', () => {
    expect(telemetryPhases()).toHaveLength(pipeline.length)
  })

  it('telemetryPhases — first phase — carries the pipeline step fields', () => {
    const [firstPhase] = telemetryPhases()
    expect(firstPhase?.k).toBe(pipeline[0]?.k)
    expect(firstPhase?.color).toBe(pipeline[0]?.color)
  })

  it('telemetryPhases — last phase — reaches full progress', () => {
    const phases = telemetryPhases()
    expect(phases[phases.length - 1]?.progress).toBe(100)
  })

  it('telemetryPhases — progress values — increase monotonically across phases', () => {
    const phases = telemetryPhases()
    for (let i = 1; i < phases.length; i += 1) {
      expect(phases[i]!.progress).toBeGreaterThan(phases[i - 1]!.progress)
    }
  })
})

describe('resolveConnections', () => {
  it('resolveConnections — with known agent ids — returns matching agents in the same order', () => {
    const resolved = resolveConnections(['testudo', 'crivo'])
    expect(resolved.map((agent) => agent.id)).toEqual(['testudo', 'crivo'])
  })

  it('resolveConnections — with an unknown id mixed in — filters it out silently', () => {
    const resolved = resolveConnections(['testudo', 'not-a-real-agent'])
    expect(resolved.map((agent) => agent.id)).toEqual(['testudo'])
  })

  it('resolveConnections — with an empty list — returns an empty list', () => {
    expect(resolveConnections([])).toEqual([])
  })

  it('telemetryConnectionIds — every configured id — resolves to a real agent', () => {
    const resolved = resolveConnections(telemetryConnectionIds)
    expect(resolved).toHaveLength(telemetryConnectionIds.length)
  })
})

describe('telemetryGauges', () => {
  it('telemetryGauges — AUTOMACAO gauge — matches the share of motor-driven lifecycle stages', () => {
    const motorCount = cardLifecycle.filter((stage) => stage.actor === 'motor').length
    const expectedPct = Math.round((motorCount / cardLifecycle.length) * 100)
    const gauge = telemetryGauges.find((g) => g.id === 'AUTOMACAO')
    expect(gauge?.value).toBe(expectedPct)
  })

  it('telemetryGauges — ATE_PREVIEW gauge — matches the share of stages up to and including PREVIEW', () => {
    const previewIndex = cardLifecycle.findIndex((stage) => stage.id === 'PREVIEW')
    const expectedPct = Math.round(((previewIndex + 1) / cardLifecycle.length) * 100)
    const gauge = telemetryGauges.find((g) => g.id === 'ATE_PREVIEW')
    expect(gauge?.value).toBe(expectedPct)
  })

  it('telemetryGauges — GATE gauge — is always full at 100', () => {
    const gauge = telemetryGauges.find((g) => g.id === 'GATE')
    expect(gauge?.value).toBe(100)
  })

  it('telemetryGauges — all gauges — ids are distinct', () => {
    const ids = telemetryGauges.map((gauge) => gauge.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })
})

describe('telemetryStats', () => {
  it('telemetryStats — pipeline phase count — matches the number of pipeline steps', () => {
    expect(telemetryStats[0]?.value).toBe(String(pipeline.length).padStart(2, '0'))
  })

  it('telemetryStats — specialist agent count — matches non-gated agents', () => {
    const specialistCount = agents.filter((agent) => !agent.gate).length
    expect(telemetryStats[1]?.value).toBe(String(specialistCount).padStart(2, '0'))
  })

  it('telemetryStats — gate agent count — matches gated agents', () => {
    const gateCount = agents.filter((agent) => agent.gate).length
    expect(telemetryStats[2]?.value).toBe(String(gateCount).padStart(2, '0'))
  })

  it('telemetryStats — card lifecycle stage count — matches cardLifecycle length', () => {
    expect(telemetryStats[3]?.value).toBe(String(cardLifecycle.length).padStart(2, '0'))
  })
})
