import type Ref from './Ref'
import type { ValidateResult, NativeFieldValue } from 'react-hook-form'

export type FormValues = Record<string, any>

export type FieldValue =
  | Date
  | FileList
  | NativeFieldValue
  | Record<string, Date | NativeFieldValue>

export interface MessageArguments {
  ref?: Ref<any>
  constraints?:
    | { size: number; formattedSize: string }
    | { type: string | string[] | RegExp }
    | { length: number }
    | { regexp: RegExp }
    | { pattern: string }
    | { values: unknown[] }
    | { resolved: unknown[]; fields: string[] }
}

export type Message =
  | string
  | ((fieldValue: FieldValue, args: MessageArguments) => string)

export type NullableFieldValue<TFieldValue extends FieldValue> =
  | TFieldValue
  | null
  | undefined

export interface HookFormLocale {
  required: Message
  email: Message
  regexp: Message
  'regexp.not': Message
  pattern: Message
  string: Message
  number: Message
  array: Message
  boolean: Message
  ipAddress: Message
  eq: Message
  neq: Message
  'length.file': Message
  'length.array': Message
  'length.string': Message
  'minLength.file': Message
  'minLength.array': Message
  'minLength.string': Message
  'maxLength.file': Message
  'maxLength.array': Message
  'maxLength.string': Message
  fileSize: Message
  fileType: Message
  lt: Message
  lte: Message
  gt: Message
  gte: Message
}

export type SyncValidate<
  TFieldValue extends FieldValue = FieldValue,
  TFormValues extends FormValues = FormValues
> = (
  value: NullableFieldValue<TFieldValue>,
  formValues: TFormValues
) => ValidateResult

export type AsyncValidate<
  TFieldValue extends FieldValue = FieldValue,
  TFormValues extends FormValues = FormValues
> = (
  value: NullableFieldValue<TFieldValue>,
  formValues: TFormValues
) => Promise<ValidateResult>

export type Validate<
  TFieldValue extends FieldValue = FieldValue,
  TFormValues extends FormValues = FormValues
> =
  | SyncValidate<TFieldValue, TFormValues>
  | AsyncValidate<TFieldValue, TFormValues>

export type ComparableValues = number | Date

export type HookFormRules<
  TFieldValue extends FieldValue = FieldValue,
  TFormValues extends FormValues = FormValues
> = Record<string, Validate<TFieldValue, TFormValues>>

export type HookFormCustomRuleFn = (...args: any[]) => Validate
