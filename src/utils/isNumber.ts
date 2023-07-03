function isNumber(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    !Number.isNaN(value) &&
    value !== Infinity &&
    value !== -Infinity
  )
}

export default isNumber
