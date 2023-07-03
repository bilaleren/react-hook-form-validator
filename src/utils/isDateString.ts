import isString from './isString'

/**
 * YYYY-MM-DD or YYYY-MM-DDTHH:mm
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local
 */
const HTML_DATE_INPUT_FORMAT_REGEXP =
  /^(?!0)\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[01])(T(0[0-9]|1[0-9]|2[1-3]):(0[0-9]|[1-5][0-9]))?$/

export function isDateString(value: unknown): value is string {
  return isString(value) && HTML_DATE_INPUT_FORMAT_REGEXP.test(value)
}

export default isDateString
