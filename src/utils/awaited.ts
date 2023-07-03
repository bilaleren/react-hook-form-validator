async function awaited<T>(value: T | Promise<T> | PromiseLike<T>): Promise<T> {
  return value instanceof Promise ? await value : value
}

export default awaited
