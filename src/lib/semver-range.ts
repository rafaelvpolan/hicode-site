export interface Semver {
  major: number
  minor: number
  patch: number
}

export function parseSemver(version: string): Semver {
  const match = /^(\d+)\.(\d+)\.(\d+)/.exec(version)
  if (!match) {
    throw new Error(`invalid semver: ${version}`)
  }
  return { major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3]) }
}

function compareSemver(a: Semver, b: Semver): number {
  if (a.major !== b.major) return a.major - b.major
  if (a.minor !== b.minor) return a.minor - b.minor
  return a.patch - b.patch
}

export function satisfiesRange(version: string, range: string): boolean {
  const resolved = parseSemver(version)

  if (range.startsWith('^')) {
    const base = parseSemver(range.slice(1))
    const upperExclusive: Semver =
      base.major > 0
        ? { major: base.major + 1, minor: 0, patch: 0 }
        : base.minor > 0
          ? { major: 0, minor: base.minor + 1, patch: 0 }
          : { major: 0, minor: 0, patch: base.patch + 1 }
    return compareSemver(resolved, base) >= 0 && compareSemver(resolved, upperExclusive) < 0
  }

  if (range.startsWith('~')) {
    const base = parseSemver(range.slice(1))
    const upperExclusive: Semver = { major: base.major, minor: base.minor + 1, patch: 0 }
    return compareSemver(resolved, base) >= 0 && compareSemver(resolved, upperExclusive) < 0
  }

  return compareSemver(resolved, parseSemver(range)) === 0
}
