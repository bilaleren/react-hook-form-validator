import { booleanRule } from '../../rules'
import { createMessage } from '../../utils'
import { getLocale } from '../../hookFormValidator'

const locale = getLocale()

describe('booleanRule()', () => {
  describe('✅ a boolean', () => {
    it.each([true, false])('"%p" must be a boolean', (value) => {
      const validate = booleanRule(locale)

      expect(validate(value, {})).toBe(true)
    })
  })

  describe('❌ not a boolean', () => {
    it.each([
      [],
      1,
      0,
      -1,
      1.1,
      -1.1,
      '',
      {},
      () => {},
      null,
      undefined,
      /1/,
      new Date()
    ])('"%p" must be not a boolean', (value) => {
      // default
      const validate1 = booleanRule(locale)
      // custom message
      const validate2 = booleanRule(locale, 'custom message')

      expect(validate1(value as any, {})).toBe(
        createMessage(locale.boolean, value, {})
      )

      expect(validate2(value as any, {})).toBe('custom message')
    })
  })
})
