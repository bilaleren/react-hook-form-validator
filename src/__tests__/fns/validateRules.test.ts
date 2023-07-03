import validateRules from '../../fns/validateRules'
import createFileList from '../../utils/test/createFileList'

describe('validateRules()', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  it('should return required message', () => {
    const validate = validateRules(
      {},
      {
        isRequired: true,
        requiredMessage: 'required message'
      }
    )

    expect(validate('', {})).resolves.toBe('required message')
    expect(validate(null, {})).resolves.toBe('required message')
    expect(validate(undefined, {})).resolves.toBe('required message')
    expect(validate([], {})).resolves.toBe('required message')
    expect(validate(createFileList([]), {})).resolves.toBe('required message')
  })

  it('should return true when the field is not required', () => {
    const validate = validateRules(
      {},
      {
        isRequired: false,
        requiredMessage: 'required message'
      }
    )

    expect(validate('', {})).resolves.toBe(true)
    expect(validate(null, {})).resolves.toBe(true)
    expect(validate(undefined, {})).resolves.toBe(true)
    expect(validate([], {})).resolves.toBe(true)
    expect(validate(createFileList([]), {})).resolves.toBe(true)
  })

  it('rule name should return as error message when sync validation result is falsy', () => {
    const nullRule = jest.fn().mockReturnValue(null)
    const falseRule = jest.fn().mockReturnValue(false)
    const undefRule = jest.fn().mockReturnValue(undefined)
    const emptyRule = jest.fn().mockReturnValue('')

    const nullValidate = validateRules({
      nullRule
    })
    const falseValidate = validateRules({
      falseRule
    })
    const undefValidate = validateRules({
      undefRule
    })
    const emptyValidate = validateRules({
      emptyRule
    })

    expect(nullValidate('value', {})).resolves.toBe('nullRule')
    expect(nullRule).toBeCalledWith('value', {})

    expect(falseValidate('value', {})).resolves.toBe('falseRule')
    expect(falseRule).toBeCalledWith('value', {})

    expect(undefValidate('value', {})).resolves.toBe('undefRule')
    expect(undefRule).toBeCalledWith('value', {})

    expect(emptyValidate('value', {})).resolves.toBe('emptyRule')
    expect(emptyRule).toBeCalledWith('value', {})
  })

  it('rule name should return as error message when async validation result is falsy', () => {
    const nullRule = jest.fn().mockResolvedValue(null)
    const falseRule = jest.fn().mockResolvedValue(false)
    const undefRule = jest.fn().mockResolvedValue(undefined)
    const emptyRule = jest.fn().mockResolvedValue('')

    const nullValidate = validateRules({
      nullRule
    })
    const falseValidate = validateRules({
      falseRule
    })
    const undefValidate = validateRules({
      undefRule
    })
    const emptyValidate = validateRules({
      emptyRule
    })

    expect(nullValidate('value', {})).resolves.toBe('nullRule')
    expect(nullRule).toBeCalledWith('value', {})

    expect(falseValidate('value', {})).resolves.toBe('falseRule')
    expect(falseRule).toBeCalledWith('value', {})

    expect(undefValidate('value', {})).resolves.toBe('undefRule')
    expect(undefRule).toBeCalledWith('value', {})

    expect(emptyValidate('value', {})).resolves.toBe('emptyRule')
    expect(emptyRule).toBeCalledWith('value', {})
  })

  it('should return validation string message', () => {
    const anyRule = jest.fn().mockReturnValue('error message')

    const validate = validateRules({
      anyRule
    })

    expect(validate('value', {})).resolves.toBe('error message')
    expect(anyRule).toBeCalledWith('value', {})
  })

  it('should return validation array message', () => {
    const anyRule = jest.fn().mockReturnValue(['error message'])

    const validate = validateRules({
      anyRule
    })

    expect(validate('value', {})).resolves.toStrictEqual(['error message'])
    expect(anyRule).toBeCalledWith('value', {})
  })

  it('should validate rules', async () => {
    const rule1 = jest.fn().mockReturnValue(true)
    const rule2 = jest.fn().mockResolvedValue(true)

    const validate = validateRules({
      rule1,
      rule2
    })

    await expect(validate('value', {})).resolves.toBe(true)

    expect(rule1).toBeCalledWith('value', {})
    expect(rule2).toBeCalledWith('value', {})
  })
})
