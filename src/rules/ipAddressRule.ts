import isIpAddress from '../utils/isIpAddress'
import createMessage from '../utils/createMessage'
import type {
  Message,
  FormValues,
  FieldValue,
  SyncValidate,
  HookFormLocale
} from '../types'

function ipAddressRule<
  TFieldValue extends FieldValue = FieldValue,
  TFormValues extends FormValues = FormValues
>(
  locale: HookFormLocale,
  message?: Message
): SyncValidate<TFieldValue, TFormValues> {
  return (value) => {
    if (!isIpAddress(value)) {
      return createMessage(message || locale.ipAddress, value, {})
    }

    return true
  }
}

export default ipAddressRule
