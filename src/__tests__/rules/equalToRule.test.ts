import ref from '../../fns/ref'
import { equalToRule } from '../../rules'
import { getLocale } from '../../hookFormValidator'
import createMessage from '../../utils/createMessage'

const locale = getLocale()

describe('equalToRule()', () => {
  describe('with value(s)', () => {
    describe('not: false', () => {
      it('value must be equal to "value"', () => {
        const validate = equalToRule('value', false, locale)

        expect(validate('value', {})).toBe(true)
      })

      it('value must be equal to one of "value, value2"', () => {
        const validate = equalToRule(['value', 'value2'], false, locale)

        expect(validate('value2', {})).toBe(true)
      })

      it('returns an error message when the value is not equal to "value"', () => {
        const validate1 = equalToRule<string>('value', false, locale)
        const validate2 = equalToRule<string>(
          'value',
          false,
          locale,
          'custom message'
        )

        expect(validate1('value1', {})).toBe(
          createMessage(locale.eq, 'value1', {
            constraints: {
              values: ['value']
            }
          })
        )

        expect(validate2('value2', {})).toBe('custom message')
      })

      it('returns an error message if the value is not equal to one of "value, value2"', () => {
        const validate1 = equalToRule<string>(
          ['value', 'value2'],
          false,
          locale
        )
        const validate2 = equalToRule<string>(
          ['value', 'value2'],
          false,
          locale,
          'custom message'
        )

        expect(validate1('value3', {})).toBe(
          createMessage(locale.eq, 'value3', {
            constraints: {
              values: ['value', 'value2']
            }
          })
        )

        expect(validate2('value4', {})).toBe('custom message')
      })
    })

    describe('not: true', () => {
      it('value must not be equal to "value"', () => {
        const validate = equalToRule<string>('value', true, locale)

        expect(validate('value1', {})).toBe(true)
      })

      it('value must not be equal to one of "value, value2"', () => {
        const validate = equalToRule<string>(['value', 'value2'], true, locale)

        expect(validate('value3', {})).toBe(true)
      })

      it('returns an error message when the value is equal to "value"', () => {
        const validate1 = equalToRule<string>('value', true, locale)
        const validate2 = equalToRule<string>(
          'value',
          true,
          locale,
          'custom message'
        )

        expect(validate1('value', {})).toBe(
          createMessage(locale.neq, 'value', {
            constraints: {
              values: ['value']
            }
          })
        )

        expect(validate2('value', {})).toBe('custom message')
      })

      it('returns an error message if the value is equal to one of "value, value2"', () => {
        const validate1 = equalToRule<string>(['value', 'value2'], true, locale)
        const validate2 = equalToRule<string>(
          ['value', 'value2'],
          true,
          locale,
          'custom message'
        )

        expect(validate1('value2', {})).toBe(
          createMessage(locale.neq, 'value2', {
            constraints: {
              values: ['value', 'value2']
            }
          })
        )

        expect(validate2('value', {})).toBe('custom message')
      })
    })
  })

  describe('with ref', () => {
    describe('not: false', () => {
      it('the value must be equal to the value of the field "field"', () => {
        const validate = equalToRule(ref('field'), false, locale)
        const formValues = {
          field: 'value'
        }

        expect(validate('value', formValues)).toBe(true)
      })

      it('the value must be equal to one of the "field1, field2" fields', () => {
        const validate = equalToRule(
          ref(['field1', 'field2'], 'or'),
          false,
          locale
        )
        const formValues = {
          field1: 'value',
          field2: 2
        }

        expect(validate(2, formValues)).toBe(true)
      })

      it('value must be equal to each of the "field1, field2" fields', () => {
        const validate = equalToRule(
          ref(['field1', 'field2'], 'and'),
          false,
          locale
        )
        const formValues = {
          field1: 2,
          field2: 2
        }

        expect(validate(2, formValues)).toBe(true)
      })

      it('returns an error message when the value is not equal to named field "field"', () => {
        const anyRef = ref('field')
        const validate1 = equalToRule(anyRef, false, locale)
        const validate2 = equalToRule(anyRef, false, locale, 'custom message')
        const formValues = {
          field: 'value'
        }

        expect(validate1('value1', formValues)).toBe(
          createMessage(locale.eq, 'value1', {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2('value1', formValues)).toBe('custom message')
      })

      it('returns an error message if the value is not equal to one of the fields named "field1, field2"', () => {
        const anyRef = ref(['field1', 'field2'], 'or')
        const validate = equalToRule(anyRef, false, locale)
        const formValues = {
          field1: 'value',
          field2: 1
        }

        expect(validate(2, formValues)).toBe(
          createMessage(locale.eq, 2, {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )
      })

      it('returns an error message if the value is not equal to each of the fields named "field1, field2"', () => {
        const anyRef = ref(['field1', 'field2'], 'and')
        const validate1 = equalToRule(anyRef, false, locale)
        const validate2 = equalToRule(anyRef, false, locale, 'custom message')
        const formValues = {
          field1: 3,
          field2: 1
        }

        expect(validate1(2, formValues)).toBe(
          createMessage(locale.eq, 2, {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2(2, formValues)).toBe('custom message')
      })
    })

    describe('not: true', () => {
      it('the value must not be equal to the value of the field "field"', () => {
        const validate = equalToRule(ref('field'), true, locale)
        const formValues = {
          field: 'value1'
        }

        expect(validate('value', formValues)).toBe(true)
      })

      it('the value must not be equal to one of the "field1, field2" fields', () => {
        const validate = equalToRule(ref(['field1', 'field2']), true, locale)
        const formValues = {
          field1: 1,
          field2: 2
        }

        expect(validate(3, formValues)).toBe(true)
      })

      it('returns an error message when the value is equal to named field "field"', () => {
        const anyRef = ref('field')
        const validate1 = equalToRule(anyRef, true, locale)
        const validate2 = equalToRule(anyRef, true, locale, 'custom message')
        const formValues = {
          field: 'value'
        }

        expect(validate1('value', formValues)).toBe(
          createMessage(locale.neq, 'value', {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2('value', formValues)).toBe('custom message')
      })

      it('returns an error message if the value is equal to one of the fields named "field1, field2"', () => {
        const anyRef = ref(['field1', 'field2'])
        const validate1 = equalToRule(anyRef, true, locale)
        const validate2 = equalToRule(anyRef, true, locale, 'custom message')
        const formValues = {
          field1: 'value',
          field2: 2
        }

        expect(validate1(2, formValues)).toBe(
          createMessage(locale.neq, 2, {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2(2, formValues)).toBe('custom message')
      })
    })
  })
})
