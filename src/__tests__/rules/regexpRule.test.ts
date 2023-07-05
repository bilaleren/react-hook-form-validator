import { regexpRule } from '../../rules'
import { createMessage } from '../../utils'
import { getLocale } from '../../hookFormValidator'

const locale = getLocale()

describe('regexpRule()', () => {
  describe('✅ valid', () => {
    describe('not: false', () => {
      it.each([
        ['1', /^1$/],
        ['ab', /^[a-z]{2}$/],
        ['AZ', /^[A-Z]{2}$/],
        ['12', /^[0-9]{2}$/]
      ])('the "%s" value must match the "%s" format', (value, regexp) => {
        const validate = regexpRule(regexp, false, locale)

        expect(validate(value, {})).toBe(true)
      })
    })

    describe('not: true', () => {
      it.each([
        ['2', /^1$/],
        ['AB', /^[a-z]{2}$/],
        ['ab', /^[A-Z]{2}$/],
        [',', /^[0-9]{2}$/]
      ])('the "%s" value must not match the "%s" format', (value, regexp) => {
        const validate = regexpRule(regexp, true, locale)

        expect(validate(value, {})).toBe(true)
      })
    })
  })

  describe('❌ invalid', () => {
    describe('not: false', () => {
      it.each([
        ['', /^1$/],
        ['AZ', /^[a-z]{2}$/],
        ['az', /^[A-Z]{2}$/],
        ['a', /^[0-9]{2}$/],
        [null, /^[0-9]{2}$/],
        [undefined, /^[0-9]{2}$/]
      ])(
        'return an error message when the "%s" value does not match the "%s" format',
        (value, regexp) => {
          // default
          const validate1 = regexpRule(regexp, false, locale)
          // custom message
          const validate2 = regexpRule(regexp, false, locale, 'custom message')

          expect(validate1(value, {})).toBe(
            createMessage(locale.regexp, value, {
              constraints: {
                regexp
              }
            })
          )

          expect(validate2(value, {})).toBe('custom message')
        }
      )
    })

    describe('not: true', () => {
      it.each([
        ['1', /^1$/],
        ['az', /^[a-z]{2}$/],
        ['AZ', /^[A-Z]{2}$/],
        ['53', /^[0-9]{2}$/],
        [null, /^[0-9]{2}$/],
        [undefined, /^[0-9]{2}$/]
      ])(
        'return an error message when the "%s" value matches the "%s" format',
        (value, regexp) => {
          // default
          const validate1 = regexpRule(regexp, true, locale)
          // custom message
          const validate2 = regexpRule(regexp, true, locale, 'custom message')

          expect(validate1(value, {})).toBe(
            createMessage(locale['regexp.not'], value, {
              constraints: {
                regexp
              }
            })
          )

          expect(validate2(value, {})).toBe('custom message')
        }
      )
    })
  })
})
