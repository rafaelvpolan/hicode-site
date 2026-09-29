export const pillarIconKeys = ['loop', 'nodes', 'play'] as const
export const phaseIconKeys = ['run', 'preview', 'approve', 'polish', 'merge', 'deploy'] as const

export type PillarIconKey = (typeof pillarIconKeys)[number]
export type PhaseIconKey = (typeof phaseIconKeys)[number]
export type StrokeIconKey = PillarIconKey | PhaseIconKey

export const strokeIconKeys: readonly StrokeIconKey[] = [...pillarIconKeys, ...phaseIconKeys]
