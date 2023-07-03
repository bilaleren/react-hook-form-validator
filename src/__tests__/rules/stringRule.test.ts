import { stringRule } from '../../rules'
import { createMessage } from '../../utils'
import { getLocale } from '../../hookFormValidator'

const locale = getLocale()

describe('stringRule()', () => {
  describe('✅ a string', () => {
    it.each(['', 'string'])('"%p" must be a string', (value) => {
      const validate = stringRule(locale)

      expect(validate(value, {})).toBe(true)
    })
  })

  describe('❌ not a string', () => {
    it.each([
      0,
      1,
      -1,
      1.1,
      -1.1,
      [],
      {},
      null,
      undefined,
      NaN,
      Infinity,
      -Infinity,
      new Date(),
      () => {}
    ])('"%p" must not be a string', (value) => {
      // default
      const validate1 = stringRule(locale)
      // custom message
      const validate2 = stringRule(locale, 'custom message')

      expect(validate1(value, {})).toBe(createMessage(locale.string, value, {}))

      expect(validate2(value, {})).toBe('custom message')
    })
  })
})
