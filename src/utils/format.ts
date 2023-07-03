import isDefined from './isDefined'

export type FormatValues = Record<string, unknown>

const _toString = Object.prototype.toString
const FORMAT_REGEXP = /{[a-zA-Z0-9\-_]+}/gm
const STRING_ABLE_REGEXP =
  /^\[object\s(Date|Array|RegExp|String|Number|Boolean)]$/

function valueToString(value: unknown, property: string): string {
  if (!isDefined(value)) {
    return property
  } else if (STRING_ABLE_REGEXP.test(_toString.call(value))) {
    return `${value}`
  }

  return property
}

function format(tmpl: string, values?: FormatValues): string {
  if (!values) {
    return tmpl
  }

  return tmpl.replace(FORMAT_REGEXP, (property: string) => {
    const key = property.slice(1, -1)
    return valueToString(values[key], property)
  })
}

export default format
