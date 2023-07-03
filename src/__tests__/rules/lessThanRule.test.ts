import ref from '../../fns/ref'
import addDays from '../../utils/test/addDays'
import { lessThanRule } from '../../rules'
import { getLocale } from '../../hookFormValidator'
import createMessage from '../../utils/createMessage'

const locale = getLocale()

describe('lessThanRule()', () => {
  describe('with value', () => {
    describe('strict: true', () => {
      it('value must be less than "5"', () => {
        const validate = lessThanRule(5, true, locale)

        expect(validate(4, {})).toBe(true)
      })

      it('the value must be less than today', () => {
        const validate = lessThanRule(new Date(), true, locale)

        expect(validate(addDays(new Date(), -1), {})).toBe(true)
      })

      it('returns an error message when the value is not less than "5"', () => {
        const validate1 = lessThanRule(5, true, locale)
        const validate2 = lessThanRule(5, true, locale, 'custom message')

        expect(validate1(5, {})).toBe(
          createMessage(locale.lt, 5, {
            constraints: {
              values: [5]
            }
          })
        )

        expect(validate2(5, {})).toBe('custom message')
      })

      it('returns an error message if the value is not less than today', () => {
        const validate1 = lessThanRule(new Date(), true, locale)
        const validate2 = lessThanRule(
          new Date(),
          true,
          locale,
          'custom message'
        )

        expect(validate1(addDays(new Date(), 1), {})).toBe(
          createMessage(locale.lt, addDays(new Date(), 1), {
            constraints: {
              values: [new Date()]
            }
          })
        )

        expect(validate2(addDays(new Date(), 1), {})).toBe('custom message')
      })
    })

    describe('strict: false', () => {
      it('value must be less than or equal to "5"', () => {
        const validate = lessThanRule(5, false, locale)

        expect(validate(5, {})).toBe(true)
      })

      it('the value must be less than or equal today', () => {
        const validate = lessThanRule(new Date(), false, locale)

        expect(validate(new Date(), {})).toBe(true)
      })

      it('returns an error message when the value is not less than or equal to "5"', () => {
        const validate1 = lessThanRule(5, false, locale)
        const validate2 = lessThanRule(5, false, locale, 'custom message')

        expect(validate1(6, {})).toBe(
          createMessage(locale.lte, 6, {
            constraints: {
              values: [5]
            }
          })
        )

        expect(validate2(6, {})).toBe('custom message')
      })

      it('returns an error message if the value is not less than or equal to today', () => {
        const validate1 = lessThanRule(new Date(), false, locale)
        const validate2 = lessThanRule(
          new Date(),
          false,
          locale,
          'custom message'
        )

        expect(validate1(addDays(new Date(), 1), {})).toBe(
          createMessage(locale.lte, addDays(new Date(), 1), {
            constraints: {
              values: [new Date()]
            }
          })
        )

        expect(validate2(addDays(new Date(), 1), {})).toBe('custom message')
      })
    })
  })

  describe('with ref', () => {
    describe('strict: true', () => {
      it('value must be less than the field named "field"', () => {
        const anyRef = ref('field')
        const validate = lessThanRule(anyRef, true, locale)
        const formValues = {
          field: 5
        }

        expect(validate(4, formValues)).toBe(true)
      })

      it('the value must be less than each of the fields named "field1, field2"', () => {
        const anyRef = ref(['field1', 'field2'], 'and')
        const validate = lessThanRule(anyRef, true, locale)
        const formValues = {
          field1: 5,
          field2: 4
        }

        expect(validate(3, formValues)).toBe(true)
      })

      it('the value must be less than one of the fields named "field1, field2"', () => {
        const anyRef = ref(['field1', 'field2'], 'or')
        const validate = lessThanRule(anyRef, true, locale)
        const formValues = {
          field1: 5,
          field2: 10
        }

        expect(validate(4, formValues)).toBe(true)
      })

      it('returns an error message if the value is not less than "field"', () => {
        const anyRef = ref('field')
        const validate1 = lessThanRule(anyRef, true, locale)
        const validate2 = lessThanRule(anyRef, true, locale, 'custom message')
        const formValues = {
          field: 7
        }

        expect(validate1(8, formValues)).toBe(
          createMessage(locale.lt, 8, {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2(8, formValues)).toBe('custom message')
      })

      it('returns an error message if the value is not less than all fields named "field1, field2"', () => {
        const anyRef = ref(['field1', 'field2'], 'and')
        const validate1 = lessThanRule(anyRef, true, locale)
        const validate2 = lessThanRule(anyRef, true, locale, 'custom message')
        const formValues = {
          field1: 7,
          field2: 8
        }

        expect(validate1(9, formValues)).toBe(
          createMessage(locale.lt, 9, {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2(9, formValues)).toBe('custom message')
      })

      it('returns an error message if the value is not less than one of the fields named "field1, field2"', () => {
        const anyRef = ref(['field1', 'field2'], 'or')
        const validate1 = lessThanRule(anyRef, true, locale)
        const validate2 = lessThanRule(anyRef, true, locale, 'custom message')
        const formValues = {
          field1: 7,
          field2: 8
        }

        expect(validate1(8, formValues)).toBe(
          createMessage(locale.lt, 8, {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2(8, formValues)).toBe('custom message')
      })
    })

    describe('strict: false', () => {
      it('value must be less than or equal to the field named "field"', () => {
        const anyRef = ref('field')
        const validate = lessThanRule(anyRef, false, locale)
        const formValues = {
          field: 6
        }

        expect(validate(6, formValues)).toBe(true)
      })

      it('the value must be less than or equal to each of the fields named "field1, field2"', () => {
        const anyRef = ref(['field1', 'field2'], 'and')
        const validate = lessThanRule(anyRef, false, locale)
        const formValues = {
          field1: 6,
          field2: 7
        }

        expect(validate(6, formValues)).toBe(true)
      })

      it('the value must be less than or equal to one of the fields named "field1, field2"', () => {
        const anyRef = ref(['field1', 'field2'], 'or')
        const validate = lessThanRule(anyRef, false, locale)
        const formValues = {
          field1: 5,
          field2: 6
        }

        expect(validate(6, formValues)).toBe(true)
      })

      it('returns an error message if the value is not less than or equal to "field"', () => {
        const anyRef = ref('field')
        const validate1 = lessThanRule(anyRef, false, locale)
        const validate2 = lessThanRule(anyRef, false, locale, 'custom message')
        const formValues = {
          field: 7
        }

        expect(validate1(8, formValues)).toBe(
          createMessage(locale.lte, 8, {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2(8, formValues)).toBe('custom message')
      })

      it('returns an error message if the value is not less than or equal to all fields named "field1, field2"', () => {
        const anyRef = ref(['field1', 'field2'], 'and')
        const validate1 = lessThanRule(anyRef, false, locale)
        const validate2 = lessThanRule(anyRef, false, locale, 'custom message')
        const formValues = {
          field1: 7,
          field2: 6
        }

        expect(validate1(7, formValues)).toBe(
          createMessage(locale.lte, 7, {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2(7, formValues)).toBe('custom message')
      })

      it('returns an error message if the value is not less than or equal to one of the fields named "field1, field2"', () => {
        const anyRef = ref(['field1', 'field2'], 'or')
        const validate1 = lessThanRule(anyRef, false, locale)
        const validate2 = lessThanRule(anyRef, false, locale, 'custom message')
        const formValues = {
          field1: 7,
          field2: 8
        }

        expect(validate1(9, formValues)).toBe(
          createMessage(locale.lte, 9, {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2(9, formValues)).toBe('custom message')
      })
    })
  })
})
