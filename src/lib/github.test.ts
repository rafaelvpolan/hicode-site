import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { repoApiUrl, repoUrl, sponsorUrl, starUrl } from './github'

const OWNER = 'rafaelvpolan'
const REPO = 'hicode'

const rootDir = fileURLToPath(new URL('../..', import.meta.url))
const srcDir = `${rootDir}/src`

describe('GitHub URLs exported by lib/github', () => {
  const urls: Array<[string, string, string]> = [
    ['repoUrl', repoUrl, `https://github.com/${OWNER}/${REPO}`],
    ['starUrl', starUrl, `https://github.com/${OWNER}/${REPO}/stargazers`],
    ['sponsorUrl', sponsorUrl, `https://github.com/sponsors/${OWNER}`],
    ['repoApiUrl', repoApiUrl, `https://api.github.com/repos/${OWNER}/${REPO}`],
  ]

  it.each(urls)('%s — points at the expected GitHub address', (_label, actual, expected) => {
    expect(actual).toBe(expected)
  })

  it.each(urls)('%s — is an absolute https URL', (_label, actual) => {
    expect(new URL(actual).protocol).toBe('https:')
  })

  it('starUrl — is the stargazers page of the same repository as repoUrl', () => {
    expect(starUrl).toBe(`${repoUrl}/stargazers`)
  })

  it('repoApiUrl — addresses the same owner/repo pair as repoUrl', () => {
    expect(new URL(repoApiUrl).pathname).toBe(`/repos${new URL(repoUrl).pathname}`)
  })

  it('repoUrl — targets the engine repository, not the site repository', () => {
    expect(repoUrl.endsWith('/hicode')).toBe(true)
  })
})

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = `${dir}/${entry.name}`
    if (entry.isDirectory()) {
      return sourceFiles(path)
    }
    return /\.(ts|vue)$/.test(entry.name) && !entry.name.endsWith('.test.ts') ? [path] : []
  })
}

describe('GitHub addresses live only in lib/github', () => {
  const githubModule = `${srcDir}/lib/github.ts`
  const hardcodedGithub = /(?:api\.)?github\.com/
  const scanned = sourceFiles(srcDir).filter((path) => path !== githubModule)

  it('the scan — reaches the modules that consume the URLs', () => {
    expect(scanned).toEqual(
      expect.arrayContaining([
        `${srcDir}/App.vue`,
        `${srcDir}/components/FinalCta.vue`,
        `${srcDir}/useGithubStars.ts`,
      ]),
    )
  })

  it('the pattern — matches lib/github.ts itself, so a miss elsewhere means absence', () => {
    expect(hardcodedGithub.test(readFileSync(githubModule, 'utf-8'))).toBe(true)
  })

  it.each(scanned.map((path) => [path.slice(rootDir.length + 1), path]))(
    '%s — has no hardcoded GitHub address',
    (_label, path) => {
      expect(hardcodedGithub.test(readFileSync(path, 'utf-8'))).toBe(false)
    },
  )
})
