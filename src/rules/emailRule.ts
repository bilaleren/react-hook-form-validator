import isEmail from '../utils/isEmail'
import createMessage from '../utils/createMessage'
import type {
  Message,
  FormValues,
  FieldValue,
  SyncValidate,
  HookFormLocale
} from '../types'

function emailRule<
  TFieldValue extends FieldValue = FieldValue,
  TFormValues extends FormValues = FormValues
>(
  locale: HookFormLocale,
  message?: Message
): SyncValidate<TFieldValue, TFormValues> {
  return (value) => {
    if (!isEmail(value)) {
      return createMessage(message || locale.email, value, {})
    }

    return true
  }
}

export default emailRule
