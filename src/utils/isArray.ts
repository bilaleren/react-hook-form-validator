function isArray(value: unknown): value is Array<any> {
  return Array.isArray(value)
}

export default isArray
