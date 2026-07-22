import { describe, expect, it } from 'vitest'
import { featureBelt, type FeatureBeltItem } from './featureBelt'

describe('featureBelt', () => {
  it('featureBelt — items — has at least one entry', () => {
    expect(featureBelt.length).toBeGreaterThan(0)
  })

  it.each(featureBelt.map((item): [string, FeatureBeltItem] => [item.label, item]))(
    'featureBelt — item %s — has a non-empty icon and label',
    (_label, item) => {
      expect(item.icon.length).toBeGreaterThan(0)
      expect(item.label.length).toBeGreaterThan(0)
    },
  )

  it('featureBelt — all items — labels are distinct', () => {
    const labels = featureBelt.map((item) => item.label)
    const uniqueLabels = new Set(labels)
    expect(uniqueLabels.size).toBe(labels.length)
  })
})
