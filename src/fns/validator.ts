import Validator from '../Validator'
import { getLocale } from '../hookFormValidator'
import type { FormValues, FieldValue } from '../types'

function validator<
  TFieldValue extends FieldValue = FieldValue,
  TFormValues extends FormValues = FormValues
>(): Validator<TFieldValue, TFormValues> {
  return new Validator<TFieldValue, TFormValues>(getLocale())
}

export default validator
