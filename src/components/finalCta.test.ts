import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

function readSource(relativePath: string): string {
  return readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), 'utf-8')
}

const finalCtaSource = readSource('./FinalCta.vue')
const appSource = readSource('../App.vue')

const CTA_URLS = ['repoUrl', 'starUrl', 'sponsorUrl']

describe('FinalCta takes its addresses from lib/github', () => {
  const importMatch = /import \{([^}]+)\} from '\.\.\/lib\/github'/.exec(finalCtaSource)

  it('the scan — finds the lib/github import in FinalCta.vue', () => {
    expect(importMatch).not.toBeNull()
  })

  const imported = (importMatch?.[1] ?? '').split(',').map((name) => name.trim())

  it.each(CTA_URLS)('%s — is imported from lib/github', (name) => {
    expect(imported).toContain(name)
  })

  it.each(CTA_URLS)('%s — is bound to the href of a call to action', (name) => {
    expect(finalCtaSource).toContain(`:href="${name}"`)
  })

  it('FinalCta — declares no props, so no caller can override the addresses', () => {
    expect(finalCtaSource).not.toContain('defineProps')
  })
})

describe('App renders FinalCta without the props it no longer declares', () => {
  const usages = [...appSource.matchAll(/<FinalCta\b([^>]*)>/g)]

  it('the scan — finds exactly one FinalCta usage in App.vue', () => {
    expect(usages).toHaveLength(1)
  })

  it('FinalCta — is rendered with no attributes', () => {
    expect(usages[0][1].replace('/', '').trim()).toBe('')
  })
})
