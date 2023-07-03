import isCountable from '../utils/isCountable'
import createMessage from '../utils/createMessage'
import typeToLocaleKey from '../utils/typeToLocaleKey'
import type {
  Message,
  FormValues,
  FieldValue,
  SyncValidate,
  HookFormLocale
} from '../types'

function minLengthRule<
  TFieldValue extends FieldValue = FieldValue,
  TFormValues extends FormValues = FormValues
>(
  length: number,
  locale: HookFormLocale,
  message?: Message
): SyncValidate<TFieldValue, TFormValues> {
  return (value) => {
    if (!isCountable(value) || value.length < length) {
      const localeKey = typeToLocaleKey(value, 'minLength')

      return createMessage(message || locale[localeKey], value, {
        constraints: {
          length
        }
      })
    }

    return true
  }
}

export default minLengthRule
