import escapePattern from './escapePattern'

const patternCache: Record<string, RegExp> = {}

function patternToRegexp(pattern: string): RegExp {
  if (patternCache[pattern]) {
    return patternCache[pattern]
  }

  const regexpPattern = escapePattern(pattern).replace(
    /(#)+/g,
    (substring) => `[0-9]{${substring.length}}`
  )

  const regexp = new RegExp(`^${regexpPattern}$`)

  patternCache[pattern] = regexp

  return regexp
}

export default patternToRegexp
