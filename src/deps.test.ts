import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { satisfiesRange } from './lib/semver-range'

interface PackageJson {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

interface LockPackageEntry {
  version?: string
  dev?: boolean
}

interface PackageLockJson {
  packages: Record<string, LockPackageEntry>
}

const rootDir = fileURLToPath(new URL('..', import.meta.url))
const packageJson: PackageJson = JSON.parse(
  readFileSync(`${rootDir}/package.json`, 'utf-8'),
) as PackageJson
const packageLockJson: PackageLockJson = JSON.parse(
  readFileSync(`${rootDir}/package-lock.json`, 'utf-8'),
) as PackageLockJson

function lockedVersion(name: string): string | undefined {
  return packageLockJson.packages[`node_modules/${name}`]?.version
}

const declaredRanges: Record<string, string> = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
}

describe('declared dependency ranges vs package-lock.json', () => {
  it('deps.test.ts — package.json — declares at least one dependency', () => {
    expect(Object.keys(declaredRanges).length).toBeGreaterThan(0)
  })

  it.each(Object.entries(declaredRanges))(
    'declared dependency %s@%s — is present in package-lock.json',
    (name) => {
      expect(lockedVersion(name)).toBeDefined()
    },
  )

  it.each(Object.entries(declaredRanges))(
    'declared dependency %s@%s — locked version satisfies the declared range',
    (name, range) => {
      const version = lockedVersion(name)
      if (version === undefined) {
        throw new Error(`missing lockfile entry for ${name}`)
      }
      expect(satisfiesRange(version, range)).toBe(true)
    },
  )
})
