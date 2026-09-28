import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { sectionTag } from './sectionTag'

const rootDir = fileURLToPath(new URL('..', import.meta.url))
const appSource = readFileSync(`${rootDir}/src/App.vue`, 'utf-8')

interface ChapterPanel {
  id: string
  index: number
}

function chapterPanelsInDocumentOrder(): ChapterPanel[] {
  const panels: ChapterPanel[] = []
  const pattern = /<Panel\s+id="([^"]+)"[^>]*?:tag="sectionTag\('CH', (\d+)\)"/g
  for (const match of appSource.matchAll(pattern)) {
    panels.push({ id: match[1], index: Number(match[2]) })
  }
  return panels
}

describe('chapter tags in App.vue', () => {
  const panels = chapterPanelsInDocumentOrder()

  it('chapter panels — parsed from App.vue — are found', () => {
    expect(panels.length).toBeGreaterThan(1)
  })

  it('chapter indices — in document order — form a gapless sequence from zero', () => {
    expect(panels.map((panel) => panel.index)).toEqual(panels.map((_, i) => i))
  })

  it('chapter indices — across all panels — are unique', () => {
    expect(new Set(panels.map((panel) => panel.index)).size).toBe(panels.length)
  })

  it('chapter labels — rendered in document order — count up without repeating', () => {
    expect(panels.map((panel) => sectionTag('CH', panel.index))).toEqual(
      panels.map((_, i) => sectionTag('CH', i)),
    )
  })

  it('faq panel — after the reorder — sits between agentes and por-que-loops', () => {
    const ids = panels.map((panel) => panel.id)
    expect(ids.indexOf('faq')).toBe(ids.indexOf('agentes') + 1)
    expect(ids.indexOf('por-que-loops')).toBe(ids.indexOf('faq') + 1)
  })
})
