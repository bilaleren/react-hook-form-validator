import ref from '../../fns/ref'
import addDays from '../../utils/test/addDays'
import { greaterThanRule } from '../../rules'
import { getLocale } from '../../hookFormValidator'
import createMessage from '../../utils/createMessage'

const locale = getLocale()

describe('greaterThanRule()', () => {
  describe('with value', () => {
    describe('strict: true', () => {
      it('value must be greater than "5"', () => {
        const validate = greaterThanRule(5, true, locale)

        expect(validate(6, {})).toBe(true)
      })

      it('the value must be greater than today', () => {
        const validate = greaterThanRule(new Date(), true, locale)

        expect(validate(addDays(new Date(), 1), {})).toBe(true)
      })

      it('returns an error message when the value is not greater than "5"', () => {
        const validate1 = greaterThanRule(5, true, locale)
        const validate2 = greaterThanRule(5, true, locale, 'custom message')

        expect(validate1(5, {})).toBe(
          createMessage(locale.gt, 5, {
            constraints: {
              values: [5]
            }
          })
        )

        expect(validate2(5, {})).toBe('custom message')
      })

      it('returns an error message if the value is not greater than today', () => {
        const validate1 = greaterThanRule(new Date(), true, locale)
        const validate2 = greaterThanRule(
          new Date(),
          true,
          locale,
          'custom message'
        )

        expect(validate1(addDays(new Date(), -1), {})).toBe(
          createMessage(locale.gt, addDays(new Date(), -1), {
            constraints: {
              values: [new Date()]
            }
          })
        )

        expect(validate2(addDays(new Date(), -1), {})).toBe('custom message')
      })
    })

    describe('strict: false', () => {
      it('value must be greater than or equal to "5"', () => {
        const validate = greaterThanRule(5, false, locale)

        expect(validate(5, {})).toBe(true)
      })

      it('the value must be greater than or equal today', () => {
        const validate = greaterThanRule(new Date(), false, locale)

        expect(validate(new Date(), {})).toBe(true)
      })

      it('returns an error message when the value is not greater than or equal to "5"', () => {
        const validate1 = greaterThanRule(5, false, locale)
        const validate2 = greaterThanRule(5, false, locale, 'custom message')

        expect(validate1(4, {})).toBe(
          createMessage(locale.gte, 4, {
            constraints: {
              values: [5]
            }
          })
        )

        expect(validate2(4, {})).toBe('custom message')
      })

      it('returns an error message if the value is not greater than or equal to today', () => {
        const validate1 = greaterThanRule(new Date(), false, locale)
        const validate2 = greaterThanRule(
          new Date(),
          false,
          locale,
          'custom message'
        )

        expect(validate1(addDays(new Date(), -1), {})).toBe(
          createMessage(locale.gte, addDays(new Date(), -1), {
            constraints: {
              values: [new Date()]
            }
          })
        )

        expect(validate2(addDays(new Date(), -1), {})).toBe('custom message')
      })
    })
  })

  describe('with ref', () => {
    describe('strict: true', () => {
      it('value must be greater than the field named "field"', () => {
        const anyRef = ref('field')
        const validate = greaterThanRule(anyRef, true, locale)
        const formValues = {
          field: 5
        }

        expect(validate(6, formValues)).toBe(true)
      })

      it('the value must be greater than each of the fields named "field1, field2"', () => {
        const anyRef = ref(['field1', 'field2'], 'and')
        const validate = greaterThanRule(anyRef, true, locale)
        const formValues = {
          field1: 5,
          field2: 4
        }

        expect(validate(6, formValues)).toBe(true)
      })

      it('the value must be greater than one of the fields named "field1, field2"', () => {
        const anyRef = ref(['field1', 'field2'], 'or')
        const validate = greaterThanRule(anyRef, true, locale)
        const formValues = {
          field1: 5,
          field2: 10
        }

        expect(validate(6, formValues)).toBe(true)
      })

      it('returns an error message if the value is not greater than "field"', () => {
        const anyRef = ref('field')
        const validate1 = greaterThanRule(anyRef, true, locale)
        const validate2 = greaterThanRule(
          anyRef,
          true,
          locale,
          'custom message'
        )
        const formValues = {
          field: 7
        }

        expect(validate1(6, formValues)).toBe(
          createMessage(locale.gt, 6, {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2(7, formValues)).toBe('custom message')
      })

      it('returns an error message if the value is not greater than all fields named "field1, field2"', () => {
        const anyRef = ref(['field1', 'field2'], 'and')
        const validate1 = greaterThanRule(anyRef, true, locale)
        const validate2 = greaterThanRule(
          anyRef,
          true,
          locale,
          'custom message'
        )
        const formValues = {
          field1: 7,
          field2: 8
        }

        expect(validate1(6, formValues)).toBe(
          createMessage(locale.gt, 6, {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2(7, formValues)).toBe('custom message')
      })

      it('returns an error message if the value is not greater than one of the fields named "field1, field2"', () => {
        const anyRef = ref(['field1', 'field2'], 'or')
        const validate1 = greaterThanRule(anyRef, true, locale)
        const validate2 = greaterThanRule(
          anyRef,
          true,
          locale,
          'custom message'
        )
        const formValues = {
          field1: 7,
          field2: 8
        }

        expect(validate1(6, formValues)).toBe(
          createMessage(locale.gt, 6, {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2(7, formValues)).toBe('custom message')
      })
    })

    describe('strict: false', () => {
      it('value must be greater than or equal to the field named "field"', () => {
        const anyRef = ref('field')
        const validate = greaterThanRule(anyRef, false, locale)
        const formValues = {
          field: 6
        }

        expect(validate(6, formValues)).toBe(true)
      })

      it('the value must be greater than or equal to each of the fields named "field1, field2"', () => {
        const anyRef = ref(['field1', 'field2'], 'and')
        const validate = greaterThanRule(anyRef, false, locale)
        const formValues = {
          field1: 6,
          field2: 6
        }

        expect(validate(6, formValues)).toBe(true)
      })

      it('the value must be greater than or equal to one of the fields named "field1, field2"', () => {
        const anyRef = ref(['field1', 'field2'], 'or')
        const validate = greaterThanRule(anyRef, false, locale)
        const formValues = {
          field1: 5,
          field2: 6
        }

        expect(validate(6, formValues)).toBe(true)
      })

      it('returns an error message if the value is not greater than or equal to "field"', () => {
        const anyRef = ref('field')
        const validate1 = greaterThanRule(anyRef, false, locale)
        const validate2 = greaterThanRule(
          anyRef,
          false,
          locale,
          'custom message'
        )
        const formValues = {
          field: 7
        }

        expect(validate1(6, formValues)).toBe(
          createMessage(locale.gte, 6, {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2(6, formValues)).toBe('custom message')
      })

      it('returns an error message if the value is not greater than or equal to all fields named "field1, field2"', () => {
        const anyRef = ref(['field1', 'field2'], 'and')
        const validate1 = greaterThanRule(anyRef, false, locale)
        const validate2 = greaterThanRule(
          anyRef,
          false,
          locale,
          'custom message'
        )
        const formValues = {
          field1: 7,
          field2: 6
        }

        expect(validate1(6, formValues)).toBe(
          createMessage(locale.gte, 6, {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2(6, formValues)).toBe('custom message')
      })

      it('returns an error message if the value is not greater than or equal to one of the fields named "field1, field2"', () => {
        const anyRef = ref(['field1', 'field2'], 'or')
        const validate1 = greaterThanRule(anyRef, false, locale)
        const validate2 = greaterThanRule(
          anyRef,
          false,
          locale,
          'custom message'
        )
        const formValues = {
          field1: 7,
          field2: 8
        }

        expect(validate1(6, formValues)).toBe(
          createMessage(locale.gte, 6, {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2(6, formValues)).toBe('custom message')
      })
    })
  })
})
