import Validator from './Validator'
import type { HookFormLocale, HookFormCustomRuleFn } from './types'

let defaultLocale: HookFormLocale = {
  eq(_, args): string {
    if (args.ref) {
      return 'This field must be equal to {fields} named field.'
    }

    return 'The value must be equal to {values}.'
  },
  neq(_, args): string {
    if (args.ref) {
      return 'This field must not be equal to {fields} named field.'
    }

    return 'The value must not be equal to {values}.'
  },
  lt(_, args): string {
    if (args.ref) {
      return 'The value must be less than the field named {fields}.'
    }

    return 'The value must be less than {values}.'
  },
  lte(_, args): string {
    if (args.ref) {
      return 'The value must be less than or equal to the field named {fields}.'
    }

    return 'The value must be less than or equal to {values}.'
  },
  gt(_, args): string {
    if (args.ref) {
      return 'The value must be greater than the field named {fields}.'
    }

    return 'The value must be greater than {values}.'
  },
  gte(_, args) {
    if (args.ref) {
      return 'The value must be greater than or equal to the field named {fields}.'
    }

    return 'The value must be greater than or equal to {values}.'
  },
  required: 'This field is required.',
  email: 'The value must be a valid e-mail address.',
  regexp: 'The value must match the format {regexp}.',
  'regexp.not': 'Value must not match the format {regexp}.',
  pattern: 'The value must match the format {pattern}.',
  string: 'The value must be a string.',
  number: 'The value must be a number.',
  array: 'The value must be a array.',
  boolean: 'The value must be a boolean.',
  ipAddress: 'The value must be a valid IP address.',
  'length.file': 'You must select {length} files.',
  'length.array': 'You must select {length} items.',
  'length.string': 'You have to enter {length} characters.',
  'maxLength.array': 'Up to {length} items can be selected.',
  'maxLength.file': 'Up to {length} files can be selected.',
  'maxLength.string': 'Up to {length} characters can be entered.',
  'minLength.array': 'At least {length} items must be selected.',
  'minLength.file': 'At least {length} files must be selected.',
  'minLength.string': 'At least {length} characters must be entered.',
  fileSize: 'The file size can be up to {formattedSize}.',
  fileType: 'Invalid file type must be file type {type}'
}

export function getLocale(): HookFormLocale {
  return defaultLocale
}

export function setLocale<TMerge extends boolean = false>(
  locale: TMerge extends true ? Partial<HookFormLocale> : HookFormLocale,
  merge?: TMerge
): void {
  if (merge) {
    defaultLocale = {
      ...defaultLocale,
      ...locale
    }
    return
  }

  defaultLocale = locale as HookFormLocale
}

export function registerValidationRule(
  name: string,
  fn: HookFormCustomRuleFn
): void {
  Object.defineProperty(Validator.prototype, name, {
    value: function (this: Validator, ...args: any[]): Validator {
      return this.registerRule(name, fn(...args), true)
    },
    writable: true,
    enumerable: false,
    configurable: true
  })
}
