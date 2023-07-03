import isArray from './isArray'
import isFileList from './isFileList'

function typeToLocaleKey<P extends string>(
  value: unknown,
  prefix: P
): `${P}.file` | `${P}.string` | `${P}.array` {
  if (isArray(value)) {
    return `${prefix}.array`
  } else if (isFileList(value)) {
    return `${prefix}.file`
  } else {
    return `${prefix}.string`
  }
}

export default typeToLocaleKey
