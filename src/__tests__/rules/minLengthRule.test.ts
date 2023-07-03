import { minLengthRule } from '../../rules'
import { createMessage } from '../../utils'
import { getLocale } from '../../hookFormValidator'
import generateMockFileList from '../../utils/test/generateMockFileList'

const locale = getLocale()

describe('minLengthRule()', () => {
  describe('✅ valid', () => {
    it('at least 2 characters must be entered', () => {
      const validate = minLengthRule(2, locale)

      expect(validate('12', {})).toBe(true)
    })

    it('at least 2 items must be selected', () => {
      const validate = minLengthRule(2, locale)

      expect(validate([1, 2, 3], {})).toBe(true)
    })

    it('at least 2 files must be selected', () => {
      const validate = minLengthRule(2, locale)

      expect(validate(generateMockFileList(2), {})).toBe(true)
    })
  })

  describe('❌ invalid', () => {
    it('return an error message if at least 2 characters are not entered', () => {
      const value = 'a'
      const validate1 = minLengthRule(2, locale)
      const validate2 = minLengthRule(2, locale, 'custom message')
      const expectedMessage = createMessage(locale['minLength.string'], value, {
        constraints: {
          length: 2
        }
      })

      expect(validate1(value, {})).toBe(expectedMessage)
      expect(validate2(value, {})).toBe('custom message')
    })

    it('return an error message when at least 2 items are not selected', () => {
      const value = [1]
      const validate1 = minLengthRule(2, locale)
      const validate2 = minLengthRule(2, locale, 'custom message')
      const expectedMessage = createMessage(locale['minLength.array'], value, {
        constraints: {
          length: 2
        }
      })

      expect(validate1(value, {})).toBe(expectedMessage)
      expect(validate2(value, {})).toBe('custom message')
    })

    it('return an error message when at least 2 files are not selected', () => {
      const value = generateMockFileList(1)
      const validate1 = minLengthRule(2, locale)
      const validate2 = minLengthRule(2, locale, 'custom message')
      const expectedMessage = createMessage(locale['minLength.file'], value, {
        constraints: {
          length: 2
        }
      })

      expect(validate1(value, {})).toBe(expectedMessage)
      expect(validate2(value, {})).toBe('custom message')
    })
  })
})
