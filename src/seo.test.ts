import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { repoUrl } from './lib/github'

const SITE_URL = 'https://rafaelvpolan.github.io/hicode-site/'
const BRAND = 'hicode'
const DESCRIPTION_MAX = 160
const TITLE_MAX = 60

const rootDir = fileURLToPath(new URL('..', import.meta.url))

function readRootFile(relativePath: string): string {
  return readFileSync(`${rootDir}/${relativePath}`, 'utf-8')
}

const indexHtml = readRootFile('index.html')
const robotsTxt = readRootFile('public/robots.txt')
const sitemapXml = readRootFile('public/sitemap.xml')
const ogImageSvg = readRootFile('public/og-image.svg')
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
) as { name?: string; url?: string; sameAs?: string[] }

const title = matchOnce(indexHtml, /<title>([^<]*)<\/title>/g, '<title>')
const description = metaContent('name', 'description')
const ogImageAlt = metaContent('property', 'og:image:alt')
const twitterImageAlt = metaContent('name', 'twitter:image:alt')
const noscript = matchOnce(indexHtml, /<noscript>([\s\S]*?)<\/noscript>/g, '<noscript>')

const ogImageText = [...ogImageSvg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)]
  .map((match) => match[1])
  .join(' ')

describe('metadata that identifies the page points at the deployed site', () => {
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
    expect(jsonLd.sameAs).toContain(repoUrl)
  })
})

describe('social preview images are served by the site itself', () => {
  const images: Array<[string, string, string]> = [
    ['og:image', metaContent('property', 'og:image'), ogImageAlt],
    ['twitter:image', metaContent('name', 'twitter:image'), twitterImageAlt],
  ]

  it.each(images)('%s — is an absolute URL under the deployed site', (_label, url) => {
    expect(url.startsWith(SITE_URL)).toBe(true)
  })

  it.each(images)('%s — declares alternative text', (_label, _url, alt) => {
    expect(alt.length).toBeGreaterThan(0)
  })

  it('og-image.svg — advertises the same repository as lib/github', () => {
    expect(ogImageText).toContain(repoUrl.replace('https://', ''))
  })
})

describe('every field that names the product says hicode', () => {
  const brandFields: Array<[string, string]> = [
    ['<title>', title],
    ['meta description', description],
    ['og:site_name', metaContent('property', 'og:site_name')],
    ['og:title', metaContent('property', 'og:title')],
    ['og:image:alt', ogImageAlt],
    ['twitter:title', metaContent('name', 'twitter:title')],
    ['twitter:image:alt', twitterImageAlt],
    ['JSON-LD name', jsonLd.name ?? ''],
    ['<noscript>', noscript],
    ['og-image.svg text', ogImageText],
  ]

  it.each(brandFields)('%s — spells the product name as hicode', (_label, text) => {
    expect(text).toContain(BRAND)
  })

  it.each(brandFields)('%s — carries no other hi-prefixed name', (_label, text) => {
    const names = [...text.matchAll(/\bhi[a-z]+/gi)].map((match) => match[0].toLowerCase())
    expect(names.length).toBeGreaterThan(0)
    expect([...new Set(names)]).toEqual([BRAND])
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
    expect(title.length).toBeGreaterThan(0)
    expect(title.length).toBeLessThanOrEqual(TITLE_MAX)
  })

  it('meta description — is present and not truncated by search engines', () => {
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
