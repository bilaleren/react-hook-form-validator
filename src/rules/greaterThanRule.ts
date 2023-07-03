import type Ref from '../Ref'
import isRef from '../utils/isRef'
import createMessage from '../utils/createMessage'
import compareValues from '../utils/compareValues'
import type {
  Message,
  FormValues,
  FieldValue,
  SyncValidate,
  HookFormLocale,
  ComparableValues,
  MessageArguments
} from '../types'

function greaterThanRule<
  TFieldValue extends FieldValue = FieldValue,
  TFormValues extends FormValues = FormValues
>(
  valueOrRef: ComparableValues | Ref<TFormValues>,
  strict: boolean,
  locale: HookFormLocale,
  message?: Message
): SyncValidate<TFieldValue, TFormValues> {
  const operator = strict ? '>' : '>='
  const localeKey: keyof HookFormLocale = strict ? 'gt' : 'gte'

  return (fieldValue, formValues) => {
    let result: boolean
    let values: unknown[]
    let messageArguments: MessageArguments

    const predicate = (value: unknown): boolean => {
      return compareValues(fieldValue, value, operator)
    }

    if (isRef(valueOrRef)) {
      const ref = valueOrRef
      const refPaths = ref.getPaths()
      const condition = ref.getCondition()
      const resolved = ref.resolveValues(formValues)

      values = resolved
      messageArguments = {
        ref,
        constraints: {
          fields: refPaths,
          resolved
        }
      }
      result =
        condition === 'and' ? values.every(predicate) : values.some(predicate)
    } else {
      messageArguments = {
        constraints: {
          values: [valueOrRef]
        }
      }
      result = predicate(valueOrRef)
    }

    if (!result) {
      return createMessage(
        message || locale[localeKey],
        fieldValue,
        messageArguments
      )
    }

    return true
  }
}

export default greaterThanRule
