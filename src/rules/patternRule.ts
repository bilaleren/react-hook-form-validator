import isString from '../utils/isString'
import createMessage from '../utils/createMessage'
import patternToRegexp from '../utils/patternToRegexp'
import type {
  Message,
  FormValues,
  FieldValue,
  SyncValidate,
  HookFormLocale
} from '../types'

function patternRule<
  TFieldValue extends FieldValue = FieldValue,
  TFormValues extends FormValues = FormValues
>(
  pattern: string,
  locale: HookFormLocale,
  message?: Message
): SyncValidate<TFieldValue, TFormValues> {
  const regexp = patternToRegexp(pattern)

  return (value) => {
    if (!isString(value) || !regexp.test(value)) {
      return createMessage(message || locale.pattern, value, {
        constraints: {
          pattern
        }
      })
    }

    return true
  }
}

export default patternRule
