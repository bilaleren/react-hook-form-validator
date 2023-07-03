import isString from '../utils/isString'

const IP_REGEXP = /^(?!.*\.$)((?!0\d)(1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/

function isIpAddress(value: unknown): boolean {
  return isString(value) && IP_REGEXP.test(value)
}

export default isIpAddress
