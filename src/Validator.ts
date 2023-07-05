import {
  arrayRule,
  emailRule,
  numberRule,
  stringRule,
  regexpRule,
  lengthRule,
  equalToRule,
  patternRule,
  booleanRule,
  fileTypeRule,
  fileSizeRule,
  maxLengthRule,
  minLengthRule,
  lessThanRule,
  ipAddressRule,
  greaterThanRule
} from './rules'
import type Ref from './Ref'
import hasOwn from './utils/hasOwn'
import validateRules from './fns/validateRules'
import type {
  Message,
  Validate,
  FieldValue,
  FormValues,
  AsyncValidate,
  HookFormRules,
  HookFormLocale,
  ComparableValues
} from './types'

class Validator<
  TFieldValue extends FieldValue = FieldValue,
  TFormValues extends FormValues = FormValues
> {
  private lastRuleId = 0

  private rules: HookFormRules<TFieldValue, TFormValues> = {}

  private isRequired = false

  private requiredMessage: Message | undefined = undefined

  constructor(readonly locale: HookFormLocale) {}

  clone(): Validator<TFieldValue, TFormValues> {
    return new Validator<TFieldValue, TFormValues>(this.locale)
  }

  required(message?: Message): this {
    this.isRequired = true
    this.requiredMessage = message

    return this
  }

  string(message?: Message): this {
    return this.registerRule('string', stringRule(this.locale, message))
  }

  number(message?: Message): this {
    return this.registerRule('number', numberRule(this.locale, message))
  }

  array(message?: Message): this {
    return this.registerRule('array', arrayRule(this.locale, message))
  }

  boolean(message?: Message): this {
    return this.registerRule('boolean', booleanRule(this.locale, message))
  }

  email(message?: Message): this {
    return this.registerRule('email', emailRule(this.locale, message))
  }

  ip(message?: Message): this {
    return this.registerRule('ip', ipAddressRule(this.locale, message))
  }

  fileSize(size: number, message?: Message, kilobyteUnit?: number): this {
    return this.registerRule(
      'fileSize',
      fileSizeRule(size, this.locale, message, kilobyteUnit)
    )
  }

  fileType(type: string | string[] | RegExp, message?: Message): this {
    return this.registerRule(
      'fileType',
      fileTypeRule(type, this.locale, message)
    )
  }

  length(length: number, message?: Message): this {
    return this.registerRule('length', lengthRule(length, this.locale, message))
  }

  minLength(length: number, message?: Message): this {
    return this.registerRule(
      'minLength',
      minLengthRule(length, this.locale, message)
    )
  }

  maxLength(length: number, message?: Message): this {
    return this.registerRule(
      'maxLength',
      maxLengthRule(length, this.locale, message)
    )
  }

  eq(
    valueOrRef: TFieldValue | TFieldValue[] | Ref<TFormValues>,
    message?: Message
  ): this {
    return this.registerRule(
      'eq',
      equalToRule(valueOrRef, false, this.locale, message),
      true
    )
  }

  neq(
    valueOrRef: TFieldValue | TFieldValue[] | Ref<TFormValues>,
    message?: Message
  ): this {
    return this.registerRule(
      'neq',
      equalToRule(valueOrRef, true, this.locale, message),
      true
    )
  }

  lt(valueOrRef: ComparableValues | Ref<TFormValues>, message?: Message): this {
    return this.registerRule(
      'lt',
      lessThanRule(valueOrRef, true, this.locale, message),
      true
    )
  }

  lte(
    valueOrRef: ComparableValues | Ref<TFormValues>,
    message?: Message
  ): this {
    return this.registerRule(
      'lte',
      lessThanRule(valueOrRef, false, this.locale, message),
      true
    )
  }

  gt(valueOrRef: ComparableValues | Ref<TFormValues>, message?: Message): this {
    return this.registerRule(
      'gt',
      greaterThanRule(valueOrRef, true, this.locale, message),
      true
    )
  }

  gte(
    valueOrRef: ComparableValues | Ref<TFormValues>,
    message?: Message
  ): this {
    return this.registerRule(
      'gte',
      greaterThanRule(valueOrRef, false, this.locale, message),
      true
    )
  }

  regexp(regexp: RegExp, message?: Message): this {
    return this.registerRule(
      'regexp',
      regexpRule(regexp, false, this.locale, message),
      true
    )
  }

  notRegexp(regexp: RegExp, message?: Message): this {
    return this.registerRule(
      'notRegexp',
      regexpRule(regexp, true, this.locale, message),
      true
    )
  }

  pattern(pattern: string, message?: Message): this {
    return this.registerRule(
      'pattern',
      patternRule(pattern, this.locale, message),
      true
    )
  }

  by(validate: Validate<TFieldValue, TFormValues>): this {
    return this.registerRule('by', validate, true)
  }

  getRules(): HookFormRules<TFieldValue, TFormValues> {
    return this.rules
  }

  validate(): AsyncValidate<TFieldValue, TFormValues> {
    const requiredMessage =
      this.requiredMessage || this.locale.required || 'required'

    return validateRules<TFieldValue, TFormValues>(this.rules, {
      isRequired: this.isRequired,
      requiredMessage
    })
  }

  registerRule(
    name: string,
    rule: Validate<TFieldValue, TFormValues>,
    multiple?: boolean
  ): this {
    const ruleName = this.getRuleName(name, multiple)

    if (!hasOwn.call(this.rules, ruleName)) {
      this.rules[ruleName] = rule
    }

    return this
  }

  private getRuleName(name: string, multiple?: boolean): string {
    if (multiple) {
      this.lastRuleId += 1
    }

    return `hookFormRule.${multiple ? `${name}${this.lastRuleId}` : name}`
  }
}

export default Validator
