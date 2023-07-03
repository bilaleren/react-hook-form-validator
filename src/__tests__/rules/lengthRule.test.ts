import { lengthRule } from '../../rules'
import { createMessage } from '../../utils'
import { getLocale } from '../../hookFormValidator'
import generateMockFileList from '../../utils/test/generateMockFileList'

const locale = getLocale()

describe('lengthRule()', () => {
  describe('✅ valid', () => {
    it('2 characters can be entered', () => {
      const validate = lengthRule(2, locale)

      expect(validate('12', {})).toBe(true)
    })

    it('2 items can be selected', () => {
      const validate = lengthRule(2, locale)

      expect(validate([1, 2], {})).toBe(true)
    })

    it('2 files can be selected', () => {
      const validate = lengthRule(2, locale)

      expect(validate(generateMockFileList(2), {})).toBe(true)
    })
  })

  describe('❌ invalid', () => {
    it('return an error message if 2 characters are not entered', () => {
      const value = '123'
      const validate1 = lengthRule(2, locale)
      const validate2 = lengthRule(2, locale, 'custom message')
      const expectedMessage = createMessage(locale['length.string'], value, {
        constraints: {
          length: 2
        }
      })

      expect(validate1(value, {})).toBe(expectedMessage)
      expect(validate2(value, {})).toBe('custom message')
    })

    it('return an error message if 2 items are not selected', () => {
      const value = [1, 2, 3]
      const validate1 = lengthRule(2, locale)
      const validate2 = lengthRule(2, locale, 'custom message')
      const expectedMessage = createMessage(locale['length.array'], value, {
        constraints: {
          length: 2
        }
      })

      expect(validate1(value, {})).toBe(expectedMessage)
      expect(validate2(value, {})).toBe('custom message')
    })

    it('return an error message if 2 files are not selected', () => {
      const value = generateMockFileList(3)
      const validate1 = lengthRule(2, locale)
      const validate2 = lengthRule(2, locale, 'custom message')
      const expectedMessage = createMessage(locale['length.file'], value, {
        constraints: {
          length: 2
        }
      })

      expect(validate1(value, {})).toBe(expectedMessage)
      expect(validate2(value, {})).toBe('custom message')
    })
  })
})
