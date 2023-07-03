import isArray from '../utils/isArray'
import createMessage from '../utils/createMessage'
import type {
  Message,
  FormValues,
  FieldValue,
  SyncValidate,
  HookFormLocale
} from '../types'

function arrayRule<
  TFieldValue extends FieldValue = FieldValue,
  TFormValues extends FormValues = FormValues
>(
  locale: HookFormLocale,
  message?: Message
): SyncValidate<TFieldValue, TFormValues> {
  return (value) => {
    if (!isArray(value)) {
      return createMessage(message || locale.array, value, {})
    }

    return true
  }
}

export default arrayRule
