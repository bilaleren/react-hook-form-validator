import { maxLengthRule } from '../../rules'
import { createMessage } from '../../utils'
import { getLocale } from '../../hookFormValidator'
import generateMockFileList from '../../utils/test/generateMockFileList'

const locale = getLocale()

describe('maxLengthRule()', () => {
  describe('✅ valid', () => {
    it('up to 2 characters can be entered', () => {
      const validate = maxLengthRule(2, locale)

      expect(validate('12', {})).toBe(true)
    })

    it('up to 2 items can be selected', () => {
      const validate = maxLengthRule(2, locale)

      expect(validate([1, 2], {})).toBe(true)
    })

    it('up to 2 files can be selected', () => {
      const validate = maxLengthRule(2, locale)

      expect(validate(generateMockFileList(2), {})).toBe(true)
    })
  })

  describe('❌ invalid', () => {
    it('return an error message if more than 2 characters are entered', () => {
      const value = '123'
      const validate1 = maxLengthRule(2, locale)
      const validate2 = maxLengthRule(2, locale, 'custom message')
      const expectedMessage = createMessage(locale['maxLength.string'], value, {
        constraints: {
          length: 2
        }
      })

      expect(validate1(value, {})).toBe(expectedMessage)
      expect(validate2(value, {})).toBe('custom message')
    })

    it('return an error message if more than 2 items are selected', () => {
      const value = [1, 2, 3]
      const validate1 = maxLengthRule(2, locale)
      const validate2 = maxLengthRule(2, locale, 'custom message')
      const expectedMessage = createMessage(locale['maxLength.array'], value, {
        constraints: {
          length: 2
        }
      })

      expect(validate1(value, {})).toBe(expectedMessage)
      expect(validate2(value, {})).toBe('custom message')
    })

    it('return an error message if more than 2 files are selected', () => {
      const value = generateMockFileList(3)
      const validate1 = maxLengthRule(2, locale)
      const validate2 = maxLengthRule(2, locale, 'custom message')
      const expectedMessage = createMessage(locale['maxLength.file'], value, {
        constraints: {
          length: 2
        }
      })

      expect(validate1(value, {})).toBe(expectedMessage)
      expect(validate2(value, {})).toBe('custom message')
    })
  })
})
