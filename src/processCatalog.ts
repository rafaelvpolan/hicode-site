import { pipeline } from './pipeline'
import type { ProcessTask } from './engineTypes'

export const processAgents = [
  'limpio',
  'escudo',
  'testudo',
  'radix',
  'crivo',
  'vitro',
  'rufus',
  'celer',
  'frontiteto',
] as const

export type ProcessAgentName = (typeof processAgents)[number]

export const processStageCount = pipeline.length

const CARD_NUMBER_MIN = 12
const CARD_NUMBER_MAX = 96

export function stageLabel(stageIndex: number): string {
  return (pipeline[stageIndex] ?? pipeline[0]).k
}

export function stageColor(stageIndex: number): string {
  return (pipeline[stageIndex] ?? pipeline[0]).color
}

export function formatCardId(numericId: number): string {
  return `#${String(numericId).padStart(3, '0')}`
}

export function pickProcessAgent(): ProcessAgentName {
  return processAgents[Math.floor(Math.random() * processAgents.length)] as ProcessAgentName
}

function randomCardNumber(): number {
  return Math.floor(Math.random() * (CARD_NUMBER_MAX - CARD_NUMBER_MIN + 1)) + CARD_NUMBER_MIN
}

let taskSequence = 0

export function createProcessTask(stageIndex: number): ProcessTask {
  taskSequence += 1
  return {
    id: `task-${taskSequence}`,
    cardId: formatCardId(randomCardNumber()),
    agent: pickProcessAgent(),
    stageIndex,
    spark: stageIndex > 0,
  }
}
