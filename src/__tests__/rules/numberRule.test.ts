import { numberRule } from '../../rules'
import { createMessage } from '../../utils'
import { getLocale } from '../../hookFormValidator'

const locale = getLocale()

describe('numberRule()', () => {
  describe('✅ a number', () => {
    it.each([0, 1, -1, 1.1, -1.1])('"%p" must be a number', (value) => {
      const validate = numberRule(locale)

      expect(validate(value, {})).toBe(true)
    })
  })

  describe('❌ not a number', () => {
    it.each([
      '',
      new Date(),
      [],
      {},
      () => {},
      null,
      undefined,
      true,
      false,
      NaN,
      Infinity,
      -Infinity
    ])('"%p" must not be a number', (value) => {
      // default
      const validate1 = numberRule(locale)
      // custom message
      const validate2 = numberRule(locale, 'custom message')

      expect(validate1(value as any, {})).toBe(
        createMessage(locale.number, value, {})
      )
      expect(validate2(value as any, {})).toBe('custom message')
    })
  })
})
