import isString from '../utils/isString'
import createMessage from '../utils/createMessage'
import type {
  Message,
  FormValues,
  FieldValue,
  SyncValidate,
  HookFormLocale
} from '../types'

function regexpRule<
  TFieldValue extends FieldValue = FieldValue,
  TFormValues extends FormValues = FormValues
>(
  regexp: RegExp,
  locale: HookFormLocale,
  message?: Message
): SyncValidate<TFieldValue, TFormValues> {
  return (value) => {
    if (!isString(value) || !regexp.test(value)) {
      return createMessage(message || locale.regexp, value, {
        constraints: {
          regexp
        }
      })
    }

    return true
  }
}

export default regexpRule
