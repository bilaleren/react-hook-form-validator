import isDate from './isDate'
import isEqual from './isEqual'
import isNumber from './isNumber'
import isDateString from './isDateString'

export type Operators = '==' | '!=' | '>' | '>=' | '<' | '<='

function detectValue(value: unknown, operator: Operators): unknown {
  if (operator !== '==' && operator !== '!=') {
    if (isDate(value)) {
      return value.getTime()
    } else if (isDateString(value)) {
      return new Date(value).getTime()
    }
  }

  return value
}

function compareValues(a: unknown, b: unknown, operator?: Operators): boolean {
  a = detectValue(a, operator || '==')
  b = detectValue(b, operator || '==')

  switch (operator) {
    default:
    case '==':
      return isEqual(a, b)
    case '!=':
      return !isEqual(a, b)
    case '>':
      return isNumber(a) && isNumber(b) && a > b
    case '>=':
      return isNumber(a) && isNumber(b) && a >= b
    case '<':
      return isNumber(a) && isNumber(b) && a < b
    case '<=':
      return isNumber(a) && isNumber(b) && a <= b
  }
}

export default compareValues
