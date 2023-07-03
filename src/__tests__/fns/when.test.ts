import ref from '../../fns/ref'
import when from '../../fns/when'
import validator from '../../fns/validator'
import addDays from '../../utils/test/addDays'

describe('when()', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  it('should throw an error if "than()" or "otherwise()" methods are not specified', () => {
    expect(() => {
      when(ref('field'), {
        is: true
      })
    }).toThrow(TypeError)
  })

  describe('one field', () => {
    it('the "is" attribute should return the condition', async () => {
      const instance = validator()
      const isFn = jest.fn().mockImplementation((values: any[]) => {
        return values.every((value) => value < Date.now())
      })
      const thenFn = jest.fn().mockReturnValue(instance)
      const otherwiseFn = jest.fn().mockReturnValue(instance)
      const validate = when(ref('field'), {
        is: isFn,
        then: thenFn,
        otherwise: otherwiseFn
      })

      const formValues: any = {
        field: addDays(new Date(), -1)
      }

      await validate('', formValues)

      expect(otherwiseFn).not.toBeCalled()
      expect(isFn).toBeCalledWith(Object.values(formValues), '', formValues)
      expect(thenFn).toBeCalledWith(instance)
    })

    it('the `than()` method should call when the "field" field is "true"', async () => {
      const instance = validator()
      const thenFn = jest.fn().mockReturnValue(instance)
      const otherwiseFn = jest.fn().mockReturnValue(instance)
      const validate = when(ref('field'), {
        is: true, // expected value
        then: thenFn,
        otherwise: otherwiseFn
      })

      await validate('', { field: true })

      expect(otherwiseFn).not.toBeCalled()
      expect(thenFn).toBeCalledWith(instance)
    })

    it('the `otherwise()` method should call when the "field" field is "false"', async () => {
      const instance = validator()
      const thenFn = jest.fn().mockReturnValue(instance)
      const otherwiseFn = jest.fn().mockReturnValue(instance)
      const validate = when(ref('field'), {
        is: true, // expected value
        then: thenFn,
        otherwise: otherwiseFn
      })

      await validate('', { field: false })

      expect(thenFn).not.toBeCalled()
      expect(otherwiseFn).toBeCalledWith(instance)
    })
  })

  describe('multiple field', () => {
    it('the "is" attribute should return the condition', async () => {
      const instance = validator()
      const isFn = jest.fn().mockImplementation((values: any[]) => {
        return values.every((value) => value > 1)
      })
      const thenFn = jest.fn().mockReturnValue(instance)
      const otherwiseFn = jest.fn().mockReturnValue(instance)
      const validate = when(ref(['field', 'field2']), {
        is: isFn, // expected value
        then: thenFn,
        otherwise: otherwiseFn
      })

      const formValues: any = {
        field: 2,
        field2: 3
      }

      await validate('', formValues)

      expect(otherwiseFn).not.toBeCalled()
      expect(thenFn).toBeCalledWith(instance)
      expect(isFn).toBeCalledWith(Object.values(formValues), '', formValues)
    })

    it('the `than()` method should call when the all fields value is "true"', async () => {
      const instance = validator()
      const thenFn = jest.fn().mockReturnValue(instance)
      const otherwiseFn = jest.fn().mockReturnValue(instance)
      const validate = when(ref(['field', 'field2']), {
        is: true, // expected value
        then: thenFn,
        otherwise: otherwiseFn
      })

      await validate('', { field: true, field2: true })

      expect(otherwiseFn).not.toBeCalled()
      expect(thenFn).toBeCalledWith(instance)
    })

    it('the `otherwise()` method should call when the all fields value is "false"', async () => {
      const instance = validator()
      const thenFn = jest.fn().mockReturnValue(instance)
      const otherwiseFn = jest.fn().mockReturnValue(instance)
      const validate = when(ref(['field', 'field2']), {
        is: true, // expected value
        then: thenFn,
        otherwise: otherwiseFn
      })

      await validate('', { field: false, field2: false })

      expect(thenFn).not.toBeCalled()
      expect(otherwiseFn).toBeCalledWith(instance)
    })
  })
})
