## React Hook Form Validator

![](https://badgen.net/packagephobia/install/react-hook-form-validator)
![](https://badgen.net/bundlephobia/min/react-hook-form-validator)
![](https://badgen.net/bundlephobia/minzip/react-hook-form-validator)
![](https://badgen.net/npm/dw/react-hook-form-validator)
![](https://badgen.net/npm/dm/react-hook-form-validator)
![](https://badgen.net/npm/license/react-hook-form-validator)

Allows you to perform simple and medium-level field validations with [react-hook-form](https://www.npmjs.com/package/react-hook-form).

### Installation

```shell
yarn add react-hook-form-validator
```

or

```shell
npm i react-hook-form-validator
```

### Contents

- [API](#api)
- [Register custom rule](#register-custom-rule)
- [Customize locale](#customize-locale)
- [Examples](#examples)
  - [Basic example](#basic-example)
  - [Password confirmation example](#password-confirmation-example)
  - [One of example](#one-of-example)
  - [Regexp example](#regexp-example)
  - [Pattern example](#pattern-example)
  - [Conditional validation example](#conditional-validation-example)
  - [File(s) size example](#files-size-example)
  - [File(s) type example](#files-type-example)

### API

#### `.required(message?: string | function): Validator`

If the length of the value (string, array, FileList) is 0 or `null`, `undefined`, it is marked as failed.

#### `.string(message?: string | function): Validator`

Verifies whether the value is a string.

#### `.number(message?: string | function): Validator`

Verifies whether the value is a number. `NaN`, `Infinity` and `-Infinity` are not accepted.

#### `.array(message?: string | function): Validator`

Verifies whether the value is an array.

#### `.boolean(message?: string | function): Validator`

Verifies whether the value is a bool.

#### `.email(message?: string | function): Validator`

Validates the value as an email address using the same regex as defined by the HTML spec.

#### `.ip(message?: string | function): Validator`

Verifies whether the value is a valid ip address.

#### `.fileSize(size: number, message?: string | function, kilobyteUnit?: number): Validator`

Verifies that all files in the `FileList` object must be less than or equal to the specified file size.

**Note:** The `{size}` or `{formattedSize}` interpolation can be used in the `message` argument.

#### `.fileType(type: string | string[] | RegExp, message?: string | function): Validator`

Verifies whether all files in the `FileList` object match the specified file type.

**Note:** The `{type}` interpolation can be used in the `message` argument.

#### `.length(length: number, message?: string | function): Validator`

- `string` Set a length limit for the string value.
- `array` Set a length limit for the array.
- `FileList` Set a length limit for the file input.

**Note:** The `{length}` interpolation can be used in the `message` argument.

#### `.minLength(length: number, message?: string | function): Validator`

- `string` Set a minimum length limit for the string value.
- `array` Set a minimum length limit for the array.
- `FileList` Set a minimum length limit for the file input.

**Note:** The `{length}` interpolation can be used in the `message` argument.

#### `.maxLength(length: number, message?: string | function): Validator`

- `string` Set a maximum length limit for the string value.
- `array` Set a maximum length limit for the array.
- `FileList` Set a maximum length limit for the file input.

**Note:** The `{length}` interpolation can be used in the `message` argument.

#### `.eq(valueOrRef: FieldValue | FieldValue[] | Ref, message?: string | function): Validator`

- `FieldValue` Checks whether the value is equal to `FieldValue`.
- `FieldValue[]` Checks if the value is equal to any value in the array.
- `Ref` Checks if the value is equal to a different field(s).

**Note:** The `{values}`, `{resolved}` or `{fields}` interpolation can be used in the `message` argument.

#### `.neq(valueOrRef: FieldValue | FieldValue[] | Ref, message?: string | function): Validator`

- `FieldValue` Checks whether the value is not equal to `FieldValue`.
- `FieldValue[]` Checks if the value is equal to any value in the array.
- `Ref` Checks if the value is equal to a different field(s).

**Note:** The `{values}`, `{resolved}` or `{fields}` interpolation can be used in the `message` argument.

#### `.lt(valueOrRef: number | Date | Ref, message?: string | function): Validator`

- `number` Checks whether the field value is less than the specified number.
- `Date` Checks whether the field value is less than the specified Date.
- `Ref` Check if the field value is smaller than other field(s).

**Note:** The `{values}`, `{resolved}` or `{fields}` interpolation can be used in the `message` argument.

#### `.lte(valueOrRef: number | Date | Ref, message?: string | function): Validator`

- `number` Checks whether the field value is less than or equal to the specified number.
- `Date` Checks whether the field value is less than or equal to the specified Date.
- `Ref` Check that the field value is less than or equal to the other field(s).

**Note:** The `{values}`, `{resolved}` or `{fields}` interpolation can be used in the `message` argument.

#### `.gt(valueOrRef: number | Date | Ref, message?: string | function): Validator`

- `number` Checks whether the field value is greater than the specified number.
- `Date` Checks whether the field value is greater than the specified Date.
- `Ref` Check if the field value is larger than other field(s).

**Note:** The `{values}`, `{resolved}` or `{fields}` interpolation can be used in the `message` argument.

#### `.gte(valueOrRef: number | Date | Ref, message?: string | function): Validator`

- `number` Checks whether the field value is greater than or equal to the specified number.
- `Date` Checks whether the field value is greater than or equal to the specified Date.
- `Ref` Check that the field value is larger than or equal to the other field(s).

**Note:** The `{values}`, `{resolved}` or `{fields}` interpolation can be used in the `message` argument.

#### `.regexp(regexp: RegExp, message?: string | function): Validator`

Tests the field value with the specified regexp.

**Note:** The `{regexp}` interpolation can be used in the `message` argument.

#### `.notRegexp(regexp: RegExp, message?: string | function): Validator`

Tests the field value with the specified regexp.

**Note:** The `{regexp}` interpolation can be used in the `message` argument.

#### `.pattern(pattern: string, message?: string | function): Validator`

Converts a given pattern into a regexp and tests the field value with this regexp.

**Note:** The `{pattern}` interpolation can be used in the `message` argument.

#### `.by(validate: Validate): Validator`

Allows you to validate the field value with a custom validator.

### Register custom rule

```ts
import {
  validator,
  registerValidationRule
} from 'react-hook-form-validator'

declare module 'react-hook-form-validator' {
  class Validator {
    foo(arg1: string, arg2: string, ...other: unknown[]): this
  }
}

registerValidationRule('foo', (...args: unknown[]) => {
  return (value) => {
    if (value !== 'foo') {
      return 'value is not "foo"'
    }

    return true
  }
})

// then
validator().foo('arg1', 'arg2').validate()
```

### Customize locale

```ts
import { setLocale } from 'react-hook-form-validator'

// replace current locale
setLocale({
  // ...locale
})

// update current locale
setLocale({ required: 'value is required' }, true)
```

### Examples

#### Basic example

```tsx
import * as React from 'react'
import { validator } from 'react-hook-form-validator'
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'

interface AnyFormData {
  email: string
  password: string
}

const emailFieldValidate = validator<string, AnyFormData>()
  .required()
  .string()
  .email()
  .validate()

const passwordFieldValidate = validator<string, AnyFormData>()
  .required()
  .string()
  .minLength(8)
  .maxLength(20)
  .validate()

const App: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AnyFormData>()

  const handleValid: SubmitHandler<AnyFormData> = () => {}

  const handleInvalid: SubmitErrorHandler<AnyFormData> = () => {}

  return (
    <form onSubmit={handleSubmit(handleValid, handleInvalid)}>
      <input {...register('email', { validate: emailFieldValidate })} />

      {errors.email && <span role="alert">{errors.email.message}</span>}

      <input
        {...register('password', { validate: passwordFieldValidate })}
        type="password"
      />

      {errors.password && <span role="alert">{errors.password.message}</span>}

      <button type="submit" />
    </form>
  )
}
```

#### Password confirmation example

```tsx
import * as React from 'react'
import { ref, validator } from 'react-hook-form-validator'
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'

interface AnyFormData {
  password: string
  passwordConfirmation: string
}

const passwordFieldValidate = validator<string, AnyFormData>()
  .required()
  .string()
  .minLength(8)
  .maxLength(20)
  .validate()

const passwordConfirmationFieldValidate = validator<string, AnyFormData>()
  .required()
  .eq(ref('password'))
  .validate()

const App: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AnyFormData>()

  const handleValid: SubmitHandler<AnyFormData> = () => {}

  const handleInvalid: SubmitErrorHandler<AnyFormData> = () => {}

  return (
    <form onSubmit={handleSubmit(handleValid, handleInvalid)}>
      <input
        {...register('password', {
          validate: passwordFieldValidate
        })}
        type="password"
      />

      {errors.password && <span role="alert">{errors.password.message}</span>}

      <input
        {...register('passwordConfirmation', {
          validate: passwordConfirmationFieldValidate
        })}
        type="password"
      />

      {errors.passwordConfirmation && (
        <span role="alert">{errors.passwordConfirmation.message}</span>
      )}

      <button type="submit" />
    </form>
  )
}
```

#### One of example

```tsx
import * as React from 'react'
import { validator } from 'react-hook-form-validator'
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'

type GenderType = 'male' | 'female'

interface AnyFormData {
  gender: GenderType
}

const genderFieldValidate = validator<GenderType, AnyFormData>()
  .required()
  .eq(['male', 'female'])
  .validate()

const App: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AnyFormData>()

  const handleValid: SubmitHandler<AnyFormData> = () => {}

  const handleInvalid: SubmitErrorHandler<AnyFormData> = () => {}

  return (
    <form onSubmit={handleSubmit(handleValid, handleInvalid)}>
      <select {...register('gender', { validate: genderFieldValidate })}>
        <option value="" disabled>
          choose gender
        </option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      {errors.gender && <span role="alert">{errors.gender.message}</span>}

      <button type="submit" />
    </form>
  )
}
```

#### Regexp example

```tsx
import * as React from 'react'
import { validator } from 'react-hook-form-validator'
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'

interface AnyFormData {
  value: string
}

const valueFieldValidate = validator<string, AnyFormData>()
  .required()
  .string()
  .regexp(/^[0-9]+$/, 'value must be a number containing a string')
  .validate()

const App: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AnyFormData>()

  const handleValid: SubmitHandler<AnyFormData> = () => {}

  const handleInvalid: SubmitErrorHandler<AnyFormData> = () => {}

  return (
    <form onSubmit={handleSubmit(handleValid, handleInvalid)}>
      <input {...register('value', { validate: valueFieldValidate })} />

      {errors.value && <span role="alert">{errors.value.message}</span>}

      <button type="submit" />
    </form>
  )
}
```

#### Pattern example

```tsx
import * as React from 'react'
import { validator } from 'react-hook-form-validator'
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'

interface AnyFormData {
  cvv: string
  expiryDate: string
  cardNumber: string
  phoneNumber: string
}

const cvvFieldValidate = validator<string, AnyFormData>()
  .required()
  .string()
  .pattern('###')
  .validate()

const expiryDateFieldValidate = validator<string, AnyFormData>()
  .required()
  .string()
  .pattern('##/##')
  .validate()

const cardNumberFieldValidate = validator<string, AnyFormData>()
  .required()
  .string()
  .pattern('#### #### #### ####')
  .validate()

const phoneNumberFieldValidate = validator<string, AnyFormData>()
  .required()
  .string()
  .pattern('0 5## ### ## ##')
  .validate()

const App: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AnyFormData>()

  const handleValid: SubmitHandler<AnyFormData> = () => {}

  const handleInvalid: SubmitErrorHandler<AnyFormData> = () => {}

  return (
    <form onSubmit={handleSubmit(handleValid, handleInvalid)}>
      <input
        {...register('cardNumber', { validate: cardNumberFieldValidate })}
      />
      {errors.cardNumber && (
        <span role="alert">{errors.cardNumber.message}</span>
      )}

      <input
        {...register('expiryDate', { validate: expiryDateFieldValidate })}
      />
      {errors.expiryDate && (
        <span role="alert">{errors.expiryDate.message}</span>
      )}

      <input {...register('cvv', { validate: cvvFieldValidate })} />
      {errors.cvv && <span role="alert">{errors.cvv.message}</span>}

      <input
        {...register('phoneNumber', { validate: phoneNumberFieldValidate })}
      />
      {errors.phoneNumber && (
        <span role="alert">{errors.phoneNumber.message}</span>
      )}

      <button type="submit" />
    </form>
  )
}
```

#### Conditional validation example

When the value of the field named "hasPromotionCode" is "true", it is indicated that the "promotionCode" field is mandatory and must be 6 characters length.

```tsx
import * as React from 'react'
import { ref, when } from 'react-hook-form-validator'
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'

interface AnyFormData {
  promotionCode: string
  hasPromotionCode: boolean
}

const promotionCodeFieldValidate = when<string, AnyFormData>(
  ref('hasPromotionCode'),
  {
    is: true,
    then: (v) => v.required().string().length(6)
  }
)

const App: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AnyFormData>()

  const handleValid: SubmitHandler<AnyFormData> = () => {}

  const handleInvalid: SubmitErrorHandler<AnyFormData> = () => {}

  return (
    <form onSubmit={handleSubmit(handleValid, handleInvalid)}>
      <input {...register('hasPromotionCode')} type="checkbox" />

      <input
        {...register('promotionCode', { validate: promotionCodeFieldValidate })}
      />

      {errors.promotionCode && (
        <span role="alert">{errors.promotionCode.message}</span>
      )}

      <button type="submit" />
    </form>
  )
}
```

#### File(s) size example

```tsx
import * as React from 'react'
import { validator } from 'react-hook-form-validator'
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'

interface AnyFormData {
  avatar: FileList
}

const avatarFieldValidate = validator<FileList, AnyFormData>()
  .required()
  .fileSize(1000 ** 2 * 2) // max file size 2 mb
  .validate()

const App: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AnyFormData>()

  const handleValid: SubmitHandler<AnyFormData> = () => {}

  const handleInvalid: SubmitErrorHandler<AnyFormData> = () => {}

  return (
    <form onSubmit={handleSubmit(handleValid, handleInvalid)}>
      <input
        {...register('avatar', { validate: avatarFieldValidate })}
        type="file"
      />

      {errors.avatar && (
        <span role="alert">{errors.avatar.message}</span>
      )}

      <button type="submit" />
    </form>
  )
}
```

#### File(s) type example

```tsx
import * as React from 'react'
import { validator } from 'react-hook-form-validator'
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'

interface AnyFormData {
  avatar: FileList
}

const avatarFieldValidate = validator<FileList, AnyFormData>()
  .required()
  .fileType('image/png') // or /^image\/(png|jpeg)$/ or ['image/png', 'image/jpeg']
  .validate()

const App: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AnyFormData>()

  const handleValid: SubmitHandler<AnyFormData> = () => {}

  const handleInvalid: SubmitErrorHandler<AnyFormData> = () => {}

  return (
    <form onSubmit={handleSubmit(handleValid, handleInvalid)}>
      <input
        {...register('avatar', { validate: avatarFieldValidate })}
        type="file"
      />

      {errors.avatar && <span role="alert">{errors.avatar.message}</span>}

      <button type="submit" />
    </form>
  )
}
```
