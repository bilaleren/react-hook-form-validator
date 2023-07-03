import { arrayRule } from '../../rules'
import { createMessage } from '../../utils'
import { getLocale } from '../../hookFormValidator'

const locale = getLocale()

describe('arrayRule()', () => {
  describe('✅ a array', () => {
    it('"[]" must be a array', () => {
      const validate = arrayRule(locale)
      expect(validate([], {})).toBe(true)
    })

    it('"[1]" must be a array', () => {
      const validate = arrayRule(locale)
      expect(validate([1], {})).toBe(true)
    })
  })

  describe('❌ not a array', () => {
    it.each([
      '',
      '1',
      1,
      0,
      -1,
      1.1,
      -1.1,
      {},
      null,
      undefined,
      true,
      false,
      new Date(),
      () => {}
    ])('"%p" must not be a array', (value) => {
      // default
      const validate1 = arrayRule(locale)
      // custom message
      const validate2 = arrayRule(locale, 'custom message')

      expect(validate1(value as any, {})).toBe(
        createMessage(locale.array, value, {})
      )

      expect(validate2(value as any, {})).toBe('custom message')
    })
  })
})
