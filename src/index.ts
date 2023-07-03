export * from './types'

export {
  getLocale,
  setLocale,
  registerValidationRule
} from './hookFormValidator'

export * as utils from './utils'

export { default as Ref } from './Ref'
export { default as ref } from './fns/ref'
export type { ConditionType } from './Ref'

export { default as Validator } from './Validator'
export { default as validator } from './fns/validator'

export { default as when } from './fns/when'
export type { WhenOptions } from './fns/when'

export { default as validateRules } from './fns/validateRules'
export type { ValidateRulesOptions } from './fns/validateRules'
