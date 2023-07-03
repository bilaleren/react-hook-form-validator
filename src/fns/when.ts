import validator from './validator'
import type Ref from '../Ref'
import type Validator from '../Validator'
import type {
  FormValues,
  FieldValue,
  AsyncValidate,
  NullableFieldValue
} from '../types'

export interface WhenOptions<
  TFieldValue extends FieldValue = FieldValue,
  TFormValues extends FormValues = FormValues
> {
  is:
    | FieldValue
    | ((
        values: FieldValue[],
        fieldValue: NullableFieldValue<TFieldValue>,
        formValues: TFormValues
      ) => boolean)

  then?: (
    v: Validator<TFieldValue, TFormValues>
  ) => Validator<TFieldValue, TFormValues>

  otherwise?: (
    v: Validator<TFieldValue, TFormValues>
  ) => Validator<TFieldValue, TFormValues>
}

function when<
  TFieldValue extends FieldValue = FieldValue,
  TFormValues extends FormValues = FormValues
>(
  ref: Ref<TFormValues>,
  options: WhenOptions<TFieldValue, TFormValues>
): AsyncValidate<TFieldValue, TFormValues> {
  const { is, then, otherwise } = options
  const condition = ref.getCondition()

  if (!then && !otherwise) {
    throw new TypeError(
      'either `then:` or `otherwise:` is required for `when()` rule'
    )
  }

  const predicate = (value: FieldValue): boolean => {
    return value === is
  }

  const check =
    typeof is === 'function'
      ? is
      : (values: FieldValue[]): boolean => {
          return condition === 'and'
            ? values.every(predicate)
            : values.some(predicate)
        }

  return (fieldValue, formValues) => {
    const values = ref.resolveValues(formValues) as FieldValue[]
    const branch = check(values, fieldValue, formValues) ? then : otherwise

    if (typeof branch !== 'function') {
      return Promise.resolve(true)
    }

    const validate = branch(validator()).validate()

    return validate(fieldValue, formValues)
  }
}

export default when
