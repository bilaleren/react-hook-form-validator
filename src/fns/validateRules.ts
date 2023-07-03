import awaited from '../utils/awaited'
import isArray from '../utils/isArray'
import isEmpty from '../utils/isEmpty'
import isString from '../utils/isString'
import resolveValue from '../utils/resolveValue'
import type {
  Message,
  FormValues,
  FieldValue,
  AsyncValidate,
  HookFormRules
} from '../types'

export interface ValidateRulesOptions {
  isRequired?: boolean
  requiredMessage?: Message
}

function validateRules<
  TFieldValue extends FieldValue = FieldValue,
  TFormValues extends FormValues = FormValues
>(
  rules: HookFormRules<TFieldValue, TFormValues>,
  options?: ValidateRulesOptions
): AsyncValidate<TFieldValue, TFormValues> {
  const { isRequired = false, requiredMessage = 'required' } = options || {}

  return async (value, formValues) => {
    // marked as required
    if (isRequired && isEmpty(value)) {
      return resolveValue(requiredMessage, value, {})
    }

    // marked as optional
    if (!isRequired && isEmpty(value)) {
      return true
    }

    for (const ruleName in rules) {
      const validateResult = await awaited(rules[ruleName](value, formValues))

      if (!validateResult) {
        return ruleName
      } else if (isString(validateResult) || isArray(validateResult)) {
        return validateResult
      }
    }

    return true
  }
}

export default validateRules
