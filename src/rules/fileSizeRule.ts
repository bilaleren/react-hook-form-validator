import isFileList from '../utils/isFileList'
import bytesToSize from '../utils/bytesToSize'
import createMessage from '../utils/createMessage'
import type {
  Message,
  FormValues,
  FieldValue,
  SyncValidate,
  HookFormLocale
} from '../types'

function fileSizeRule<
  TFieldValue extends FieldValue = FieldValue,
  TFormValues extends FormValues = FormValues
>(
  size: number,
  locale: HookFormLocale,
  message?: Message,
  kilobyteUnit?: number
): SyncValidate<TFieldValue, TFormValues> {
  return (value) => {
    const errorMessage = createMessage(message || locale.fileSize, value, {
      constraints: {
        size,
        formattedSize: bytesToSize(size, kilobyteUnit)
      }
    })

    if (!isFileList(value)) {
      return errorMessage
    }

    const result = Array.from(value).every((file) => file.size <= size)

    if (!result) {
      return errorMessage
    }

    return true
  }
}

export default fileSizeRule
