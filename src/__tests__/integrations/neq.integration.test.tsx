import * as React from 'react'
import ref from '../../fns/ref'
import validator from '../../fns/validator'
import { createMessage } from '../../utils'
import { getLocale } from '../../hookFormValidator'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { TextInputForm, TextInputsForm } from '../../utils/test/components'

const locale = getLocale()

describe('neq.integration', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  describe('✅ valid', () => {
    it('the value of the field must not be equal to "value"', async () => {
      const handleValid = jest.fn()

      render(
        <TextInputForm
          onValid={handleValid}
          fieldValidate={validator().neq('value').validate()}
        />
      )

      await userEvent.type(screen.getByPlaceholderText('field'), 'val')
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).toBeCalled()
    })

    it('the value of the field must not be equal to one of "value, value2"', async () => {
      const handleValid = jest.fn()

      render(
        <TextInputForm
          onValid={handleValid}
          fieldValidate={validator().neq(['value', 'value2']).validate()}
        />
      )

      await userEvent.type(screen.getByPlaceholderText('field'), 'val')
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).toBeCalled()
    })

    it('the value of the field must not be equal to the field "field2"', async () => {
      const handleValid = jest.fn()

      render(
        <TextInputsForm
          onValid={handleValid}
          fieldValidate={validator().neq(ref('field2')).validate()}
        />
      )

      await userEvent.type(screen.getByPlaceholderText('field'), 'val')
      await userEvent.type(screen.getByPlaceholderText('field2'), 'value')
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).toBeCalled()
    })

    it('the value of the field must not be equal to one of the "field2, field3" fields', async () => {
      const handleValid = jest.fn()

      render(
        <TextInputsForm
          onValid={handleValid}
          fieldValidate={validator()
            .neq(ref(['field2', 'field3'], 'or'))
            .validate()}
        />
      )

      await userEvent.type(screen.getByPlaceholderText('field'), 'value')
      await userEvent.type(screen.getByPlaceholderText('field2'), 'ab')
      await userEvent.type(screen.getByPlaceholderText('field3'), 'val')
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).toBeCalled()
    })
  })

  describe('❌ invalid', () => {
    it('an error message should be shown when the value of the field is equal to "value"', async () => {
      const handleValid = jest.fn()

      render(
        <TextInputForm
          onValid={handleValid}
          fieldValidate={validator().neq('value').validate()}
        />
      )

      await userEvent.type(screen.getByPlaceholderText('field'), 'value')
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).not.toBeCalled()

      expect(
        screen.queryByText(
          createMessage(locale.neq, '', {
            constraints: {
              values: ['value']
            }
          })
        )
      ).toBeInTheDocument()
    })

    it('an error message should be shown when the value of the field is equal to one of "value, value2"', async () => {
      const handleValid = jest.fn()

      render(
        <TextInputForm
          onValid={handleValid}
          fieldValidate={validator().neq(['value', 'value2']).validate()}
        />
      )

      await userEvent.type(screen.getByPlaceholderText('field'), 'value')
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).not.toBeCalled()

      expect(
        screen.queryByText(
          createMessage(locale.neq, '', {
            constraints: {
              values: ['value', 'value2']
            }
          })
        )
      ).toBeInTheDocument()
    })

    it('display an error message when the value of the field is equal to field "field2"', async () => {
      const anyRef = ref<any>('field2')
      const handleValid = jest.fn()

      render(
        <TextInputsForm
          onValid={handleValid}
          fieldValidate={validator().neq(anyRef).validate()}
        />
      )

      await userEvent.type(screen.getByPlaceholderText('field'), 'value')
      await userEvent.type(screen.getByPlaceholderText('field2'), 'value')
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).not.toBeCalled()

      expect(
        screen.queryByText(
          createMessage(locale.neq, '', {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: []
            }
          })
        )
      ).toBeInTheDocument()
    })

    it('display an error message when the value of the field is equal to one of the "field2, field3" fields', async () => {
      const anyRef = ref<any>(['field2', 'field3'])
      const handleValid = jest.fn()

      render(
        <TextInputsForm
          onValid={handleValid}
          fieldValidate={validator().neq(anyRef).validate()}
        />
      )

      await userEvent.type(screen.getByPlaceholderText('field'), 'value')
      await userEvent.type(screen.getByPlaceholderText('field2'), 'ab')
      await userEvent.type(screen.getByPlaceholderText('field3'), 'value')
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).not.toBeCalled()

      expect(
        screen.queryByText(
          createMessage(locale.neq, '', {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: []
            }
          })
        )
      ).toBeInTheDocument()
    })
  })
})
