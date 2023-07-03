import isBoolean from '../utils/isBoolean'
import createMessage from '../utils/createMessage'
import type {
  Message,
  FormValues,
  FieldValue,
  SyncValidate,
  HookFormLocale
} from '../types'

function booleanRule<
  TFieldValue extends FieldValue = FieldValue,
  TFormValues extends FormValues = FormValues
>(
  locale: HookFormLocale,
  message?: Message
): SyncValidate<TFieldValue, TFormValues> {
  return (value) => {
    if (!isBoolean(value)) {
      return createMessage(message || locale.boolean, value, {})
    }

    return true
  }
}

export default booleanRule
