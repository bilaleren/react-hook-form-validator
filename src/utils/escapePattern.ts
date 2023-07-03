const ESCAPE_REGEXP = /[^a-zA-Z0-9#\s]/g

function escapePattern(pattern: string): string {
  return pattern.replace(ESCAPE_REGEXP, '\\$&')
}

export default escapePattern
