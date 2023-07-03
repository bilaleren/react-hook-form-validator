import { patternRule } from '../../rules'
import { createMessage } from '../../utils'
import { getLocale } from '../../hookFormValidator'

const locale = getLocale()

describe('patternRule()', () => {
  describe('✅ valid', () => {
    // # [0-9]
    it.each([
      ['', ''],
      ['05## ### ####', '0555 222 5555'],
      ['+90 216 ### ## ##', '+90 216 222 55 55'],
      ['+1 (###) ###‑####', '+1 (415) 555‑0132'],
      ['###,##', '500,10'],
      ['###', '546'],
      ['##/##', '01/27'],
      ['###.###,##', '500.150,00'],
      ['####-##-##', '2023-01-01'],
      ['####/##/##', '2023/01/01'],
      ['####.##.##', '2023.01.01']
    ])('"%s" pattern must match "%s" value', (pattern, value) => {
      const validate = patternRule(pattern, locale)

      expect(validate(value, {})).toBe(true)
    })
  })

  describe('❌ invalid', () => {
    // # [0-9]
    it.each([
      ['05## ### ####', '0 555 222 5555'],
      ['+90 216 ### ## ##', '90 216 222 55 55'],
      ['+1 (###) ###‑####', '+1(415) 555‑0132'],
      ['###,##', '50010'],
      ['###', '22'],
      ['##/##', '2/29'],
      ['###.###,##', '500.150,0'],
      ['####-##-##', '2023-0101'],
      ['####/##/##', '2023/01/1'],
      ['####.##.##', '2023.0101']
    ])('"%s" pattern must not match "%s" value', (pattern, value) => {
      // default
      const validate1 = patternRule(pattern, locale)
      // custom message
      const validate2 = patternRule(pattern, locale, 'custom message')

      expect(validate1(value, {})).toBe(
        createMessage(locale.pattern, value, {
          constraints: {
            pattern
          }
        })
      )

      expect(validate2(value, {})).toBe('custom message')
    })
  })
})
