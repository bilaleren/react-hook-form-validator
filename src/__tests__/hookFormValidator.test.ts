import Validator from '../Validator'
import ref from '../fns/ref'
import validator from '../fns/validator'
import {
  getLocale,
  setLocale,
  registerValidationRule
} from '../hookFormValidator'
import type { HookFormLocale } from '../types'

const fakeLocale: HookFormLocale = {
  eq: 'eq',
  gt: 'gt',
  gte: 'gte',
  lt: 'lt',
  lte: 'lte',
  neq: 'neq',
  'length.file': 'length.file',
  'length.array': 'length.array',
  'length.string': 'length.string',
  'maxLength.array': 'maxLength.array',
  'maxLength.file': 'maxLength.file',
  'maxLength.string': 'maxLength.string',
  'minLength.array': 'minLength.array',
  'minLength.file': 'minLength.file',
  'minLength.string': 'minLength.string',
  array: 'array',
  boolean: 'boolean',
  email: 'email',
  fileSize: 'fileSize',
  fileType: 'fileType',
  ipAddress: 'ipAddress',
  number: 'number',
  regexp: 'regexp',
  'regexp.not': 'regexp.not',
  pattern: 'pattern',
  required: 'required',
  string: 'string'
}

describe('hookFormValidator', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  describe('getLocale() & setLocale()', () => {
    it('should change the current locale', () => {
      setLocale(fakeLocale)

      expect(getLocale()).toEqual(fakeLocale)
    })

    it('should update the current locale', () => {
      setLocale(
        {
          required: 'updated required'
        },
        true
      )

      expect(getLocale()).toEqual({
        ...getLocale(),
        required: 'updated required'
      })
    })

    it('should call message function', () => {
      const messageFn = jest.fn().mockReturnValue('error message')

      setLocale({ eq: messageFn }, true)

      const validate = validator().eq('a').validate()

      expect(validate('b', {})).resolves.toBe('error message')
      expect(messageFn).toBeCalledTimes(1)
      expect(messageFn).toBeCalledWith('b', {
        constraints: {
          values: ['a']
        }
      })
    })

    it('should call message function via ref', () => {
      const anyRef = ref<any>('field')
      const messageFn = jest.fn().mockReturnValue('error message')

      setLocale({ eq: messageFn }, true)

      const validate = validator().eq(anyRef).validate()

      expect(validate('value', {})).resolves.toBe('error message')
      expect(messageFn).toBeCalledTimes(1)
      expect(messageFn).toBeCalledWith('value', {
        ref: anyRef,
        constraints: {
          fields: ['field'],
          resolved: [undefined]
        }
      })
    })
  })

  describe('registerValidationRule()', () => {
    it('a custom validation rule must be registered', async () => {
      const validateFn = jest.fn().mockReturnValue(true)
      const customRuleFn = jest.fn().mockReturnValue(validateFn)

      registerValidationRule('custom', customRuleFn)

      // @ts-ignore
      const instance = validator().custom(1, 2) as Validator

      expect(instance).toBeInstanceOf(Validator)

      expect(customRuleFn).toBeCalledTimes(1)
      expect(customRuleFn).toBeCalledWith(1, 2)

      await instance.validate()('value', {})

      expect(validateFn).toBeCalledTimes(1)
      expect(validateFn).toBeCalledWith('value', {})
    })
  })
})
