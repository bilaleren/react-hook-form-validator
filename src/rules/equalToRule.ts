import type Ref from '../Ref'
import isRef from '../utils/isRef'
import wrapArray from '../utils/wrapArray'
import createMessage from '../utils/createMessage'
import compareValues from '../utils/compareValues'
import type {
  Message,
  FormValues,
  FieldValue,
  SyncValidate,
  HookFormLocale,
  MessageArguments
} from '../types'

function equalToRule<
  TFieldValue extends FieldValue = FieldValue,
  TFormValues extends FormValues = FormValues
>(
  valueOrRef: TFieldValue | TFieldValue[] | Ref<TFormValues>,
  not: boolean,
  locale: HookFormLocale,
  message?: Message
): SyncValidate<TFieldValue, TFormValues> {
  const operator = not ? '!=' : '=='
  const localeKey: keyof HookFormLocale = not ? 'neq' : 'eq'

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
        not || condition === 'and'
          ? values.every(predicate)
          : values.some(predicate)
    } else {
      values = wrapArray(valueOrRef)
      messageArguments = {
        constraints: {
          values
        }
      }
      result = not ? values.every(predicate) : values.some(predicate)
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

export default equalToRule
