function isRegexp(value: unknown): value is RegExp {
  return value instanceof RegExp
}

export default isRegexp
