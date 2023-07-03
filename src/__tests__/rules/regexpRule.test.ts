import { regexpRule } from '../../rules'
import { createMessage } from '../../utils'
import { getLocale } from '../../hookFormValidator'

const locale = getLocale()

describe('regexpRule()', () => {
  describe('✅ valid', () => {
    it.each([
      [/^1$/, '1'],
      [/^[a-z]{2}$/, 'ab'],
      [/^[A-Z]{2}$/, 'AZ'],
      [/^[0-9]{2}$/, '12']
    ])('"%s" pattern must match "%s" value', (regexp, value) => {
      const validate = regexpRule(regexp, locale)

      expect(validate(value, {})).toBe(true)
    })
  })

  describe('❌ invalid', () => {
    it.each([
      [/^1$/, ''],
      [/^[a-z]{2}$/, 'AZ'],
      [/^[A-Z]{2}$/, 'az'],
      [/^[0-9]{2}$/, 'a']
    ])('"%s" pattern must not match "%s" value', (regexp, value) => {
      // default
      const validate1 = regexpRule(regexp, locale)
      // custom message
      const validate2 = regexpRule(regexp, locale, 'custom message')

      expect(validate1(value, {})).toBe(
        createMessage(locale.regexp, value, {
          constraints: {
            regexp
          }
        })
      )

      expect(validate2(value, {})).toBe('custom message')
    })
  })
})
