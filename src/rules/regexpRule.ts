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
  not: boolean,
  locale: HookFormLocale,
  message?: Message
): SyncValidate<TFieldValue, TFormValues> {
  const localeKey: keyof HookFormLocale = not ? 'regexp.not' : 'regexp'

  return (value) => {
    const result =
      isString(value) && (not ? !regexp.test(value) : regexp.test(value))

    if (!result) {
      return createMessage(message || locale[localeKey], value, {
        constraints: {
          regexp
        }
      })
    }

    return true
  }
}

export default regexpRule
