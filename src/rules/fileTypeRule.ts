import isRegexp from '../utils/isRegexp'
import wrapArray from '../utils/wrapArray'
import isFileList from '../utils/isFileList'
import createMessage from '../utils/createMessage'
import type {
  Message,
  FormValues,
  FieldValue,
  SyncValidate,
  HookFormLocale
} from '../types'

function fileTypeRule<
  TFieldValue extends FieldValue = FieldValue,
  TFormValues extends FormValues = FormValues
>(
  type: string | string[] | RegExp,
  locale: HookFormLocale,
  message?: Message
): SyncValidate<TFieldValue, TFormValues> {
  return (value) => {
    const errorMessage = createMessage(message || locale.fileType, value, {
      constraints: {
        type
      }
    })

    if (!isFileList(value)) {
      return errorMessage
    }

    const isValid = Array.from(value).every((file) => {
      if (isRegexp(type)) {
        return type.test(file.type)
      } else {
        return wrapArray(type).includes(file.type)
      }
    })

    if (!isValid) {
      return errorMessage
    }

    return true
  }
}

export default fileTypeRule
