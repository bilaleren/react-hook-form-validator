import { get, FieldPath } from 'react-hook-form'
import wrapArray from './utils/wrapArray'
import type { FormValues } from './types'

export type ConditionType = 'or' | 'and'

class Ref<TFormValues extends FormValues = FormValues> {
  constructor(
    private readonly paths: FieldPath<TFormValues> | FieldPath<TFormValues>[],
    private readonly condition: ConditionType = 'and'
  ) {}

  getPaths(): FieldPath<TFormValues>[] {
    return wrapArray(this.paths)
  }

  getCondition(): ConditionType {
    return this.condition
  }

  resolveValues(formValues: TFormValues): unknown[] {
    return this.getPaths().map((field) => get(formValues, field))
  }
}

export default Ref
