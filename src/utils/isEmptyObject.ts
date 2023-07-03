import hasOwn from './hasOwn'
import isPlainObject from './isPlainObject'

function isEmptyObject(
  object: unknown
): object is null | undefined | Record<string, never> {
  if (!isPlainObject(object)) {
    return true
  }

  for (const key in object) {
    if (hasOwn.call(object, key)) {
      return false
    }
  }

  return true
}

export default isEmptyObject
