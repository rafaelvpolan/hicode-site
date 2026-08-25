import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const SITE_URL = 'https://rafaelvpolan.github.io/hicode-site/'
const REPO_URL = 'https://github.com/rafaelvpolan/hicode'
const DESCRIPTION_MAX = 160
const TITLE_MAX = 60

const rootDir = fileURLToPath(new URL('..', import.meta.url))

function readRootFile(relativePath: string): string {
  return readFileSync(`${rootDir}/${relativePath}`, 'utf-8')
}

const indexHtml = readRootFile('index.html')
const robotsTxt = readRootFile('public/robots.txt')
const sitemapXml = readRootFile('public/sitemap.xml')
const viteConfig = readRootFile('vite.config.ts')

function matchOnce(source: string, pattern: RegExp, label: string): string {
  const matches = [...source.matchAll(pattern)]
  if (matches.length !== 1) {
    throw new Error(`expected exactly one ${label}, found ${matches.length}`)
  }
  return matches[0][1]
}

function metaContent(attribute: 'name' | 'property', key: string): string {
  return matchOnce(
    indexHtml,
    new RegExp(`<meta ${attribute}="${key}" content="([^"]*)"`, 'g'),
    `<meta ${attribute}="${key}">`,
  )
}

const jsonLd = JSON.parse(
  matchOnce(
    indexHtml,
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    'JSON-LD block',
  ),
) as { url?: string; sameAs?: string[] }

describe('metadata that identifies the page points at the deployed site', () => {
  // O site e o produto vivem em repos diferentes: canonical cross-domain para o
  // repo `hicode` pede ao Google para nao indexar o site inteiro.
  const pageUrls: Array<[string, string]> = [
    ['<link rel="canonical">', matchOnce(indexHtml, /<link rel="canonical" href="([^"]*)"/g, 'canonical link')],
    ['og:url', metaContent('property', 'og:url')],
    ['JSON-LD url', jsonLd.url ?? ''],
    ['sitemap <loc>', matchOnce(sitemapXml, /<loc>([^<]*)<\/loc>/g, 'sitemap <loc>')],
  ]

  it.each(pageUrls)('%s — is the deployed site URL', (_label, url) => {
    expect(url).toBe(SITE_URL)
  })

  it('JSON-LD — links the product repository as sameAs, not as url', () => {
    expect(jsonLd.sameAs).toContain(REPO_URL)
  })
})

describe('social preview images are served by the site itself', () => {
  const imageUrls: Array<[string, string]> = [
    ['og:image', metaContent('property', 'og:image')],
    ['twitter:image', metaContent('name', 'twitter:image')],
  ]

  it.each(imageUrls)('%s — is an absolute URL under the deployed site', (_label, url) => {
    expect(url.startsWith(SITE_URL)).toBe(true)
  })

  it.each(imageUrls)('%s — declares alternative text', (label) => {
    const alt = label === 'og:image'
      ? metaContent('property', 'og:image:alt')
      : metaContent('name', 'twitter:image:alt')
    expect(alt.length).toBeGreaterThan(0)
  })
})

describe('robots.txt', () => {
  it('robots.txt — advertises the sitemap hosted by the site', () => {
    const sitemapUrl = matchOnce(robotsTxt, /^Sitemap: (.+)$/gm, 'Sitemap directive')
    expect(sitemapUrl).toBe(`${SITE_URL}sitemap.xml`)
  })
})

describe('snippet length stays inside what search engines render', () => {
  it('<title> — is present and not truncated by search engines', () => {
    const title = matchOnce(indexHtml, /<title>([^<]*)<\/title>/g, '<title>')
    expect(title.length).toBeGreaterThan(0)
    expect(title.length).toBeLessThanOrEqual(TITLE_MAX)
  })

  it('meta description — is present and not truncated by search engines', () => {
    const description = metaContent('name', 'description')
    expect(description.length).toBeGreaterThan(0)
    expect(description.length).toBeLessThanOrEqual(DESCRIPTION_MAX)
  })
})

describe('canonical URL agrees with the build base path', () => {
  it('vite.config.ts base — is the path of the canonical site URL', () => {
    const base = matchOnce(viteConfig, /command === 'build' \? '([^']*)'/g, 'build base')
    expect(new URL(SITE_URL).pathname).toBe(base)
  })
})
