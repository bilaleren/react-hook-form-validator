import * as React from 'react'
import type { Validate } from '../../types'
import { useForm, SubmitHandler } from 'react-hook-form'

export interface FormComponentProps {
  onValid: SubmitHandler<any>
  fieldValidate: Validate
  inputType?: React.HTMLInputTypeAttribute
  valueAsDate?: boolean
  valueAsNumber?: boolean
}

export const TextInputForm: React.FC<FormComponentProps> = ({
  onValid,
  inputType,
  valueAsDate,
  valueAsNumber,
  fieldValidate
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  return (
    <form onSubmit={handleSubmit(onValid)}>
      <input
        {...register('field', {
          validate: fieldValidate,
          valueAsDate: valueAsDate as any,
          valueAsNumber: valueAsNumber as any
        })}
        type={inputType}
        placeholder="field"
      />

      {errors.field ? (
        <span role="alert">{errors.field.message as string}</span>
      ) : null}

      <button type="submit">submit</button>
    </form>
  )
}

export const FileInputForm: React.FC<FormComponentProps> = ({
  onValid,
  fieldValidate
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  return (
    <form onSubmit={handleSubmit(onValid)}>
      <input
        {...register('field', {
          validate: fieldValidate
        })}
        type="file"
        multiple
        placeholder="field"
      />

      {errors.field ? (
        <span role="alert">{errors.field.message as string}</span>
      ) : null}

      <button type="submit">submit</button>
    </form>
  )
}

export const SelectInputForm: React.FC<FormComponentProps> = ({
  onValid,
  fieldValidate
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  return (
    <form onSubmit={handleSubmit(onValid)}>
      <select
        {...register('field', {
          validate: fieldValidate
        })}
        multiple
        defaultValue={[]}
        placeholder="field"
      >
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>

      {errors.field ? (
        <span role="alert">{errors.field.message as string}</span>
      ) : null}

      <button type="submit">submit</button>
    </form>
  )
}

export const TextInputsForm: React.FC<FormComponentProps> = ({
  onValid,
  inputType,
  valueAsDate,
  valueAsNumber,
  fieldValidate
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  return (
    <form onSubmit={handleSubmit(onValid)}>
      <input
        {...register('field', {
          validate: fieldValidate,
          valueAsDate: valueAsDate as any,
          valueAsNumber: valueAsNumber as any
        })}
        type={inputType}
        placeholder="field"
      />

      {errors.field ? (
        <span role="alert">{errors.field.message as string}</span>
      ) : null}

      <input
        {...register('field2', {
          valueAsDate: valueAsDate as any,
          valueAsNumber: valueAsNumber as any
        })}
        type={inputType}
        placeholder="field2"
      />

      {errors.field2 ? (
        <span role="alert">{errors.field2.message as string}</span>
      ) : null}

      <input
        {...register('field3', {
          valueAsDate: valueAsDate as any,
          valueAsNumber: valueAsNumber as any
        })}
        type={inputType}
        placeholder="field3"
      />

      {errors.field3 ? (
        <span role="alert">{errors.field3.message as string}</span>
      ) : null}

      <button type="submit">submit</button>
    </form>
  )
}
