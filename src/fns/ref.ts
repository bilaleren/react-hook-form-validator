import Ref, { ConditionType } from '../Ref'
import type { FormValues } from '../types'
import type { FieldPath } from 'react-hook-form'

function ref<TFormValues extends FormValues = FormValues>(
  paths: FieldPath<TFormValues> | FieldPath<TFormValues>[],
  condition?: ConditionType
): Ref<TFormValues> {
  return new Ref<TFormValues>(paths, condition)
}

export default ref
