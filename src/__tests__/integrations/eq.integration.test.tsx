import * as React from 'react'
import ref from '../../fns/ref'
import validator from '../../fns/validator'
import { createMessage } from '../../utils'
import userEvent from '@testing-library/user-event'
import { getLocale } from '../../hookFormValidator'
import { render, screen } from '@testing-library/react'
import { TextInputForm, TextInputsForm } from '../../utils/test/components'

const locale = getLocale()

describe('eq.integration', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  describe('✅ valid', () => {
    it('the value of the field must be equal to "value"', async () => {
      const handleValid = jest.fn()

      render(
        <TextInputForm
          onValid={handleValid}
          fieldValidate={validator().eq('value').validate()}
        />
      )

      await userEvent.type(screen.getByPlaceholderText('field'), 'value')
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).toBeCalled()
    })

    it('the value of the field must be equal to one of "value, value2"', async () => {
      const handleValid = jest.fn()

      render(
        <TextInputForm
          onValid={handleValid}
          fieldValidate={validator().eq(['value', 'value2']).validate()}
        />
      )

      await userEvent.type(screen.getByPlaceholderText('field'), 'value2')
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).toBeCalled()
    })

    it('the value of the field must be equal to the field "field2"', async () => {
      const handleValid = jest.fn()

      render(
        <TextInputsForm
          onValid={handleValid}
          fieldValidate={validator().eq(ref('field2')).validate()}
        />
      )

      await userEvent.type(screen.getByPlaceholderText('field'), 'value')
      await userEvent.type(screen.getByPlaceholderText('field2'), 'value')
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).toBeCalled()
    })

    it('the value of the field must be equal to one of the "field2, field3" fields', async () => {
      const handleValid = jest.fn()

      render(
        <TextInputsForm
          onValid={handleValid}
          fieldValidate={validator()
            .eq(ref(['field2', 'field3'], 'or'))
            .validate()}
        />
      )

      await userEvent.type(screen.getByPlaceholderText('field'), 'value')
      await userEvent.type(screen.getByPlaceholderText('field2'), 'ab')
      await userEvent.type(screen.getByPlaceholderText('field3'), 'value')
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).toBeCalled()
    })
  })

  describe('❌ invalid', () => {
    it('an error message should be shown when the value of the field is not equal to "value"', async () => {
      const handleValid = jest.fn()

      render(
        <TextInputForm
          onValid={handleValid}
          fieldValidate={validator().eq('value').validate()}
        />
      )

      await userEvent.type(screen.getByPlaceholderText('field'), 'val')
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).not.toBeCalled()

      expect(
        screen.queryByText(
          createMessage(locale.eq, '', {
            constraints: {
              values: ['value']
            }
          })
        )
      ).toBeInTheDocument()
    })

    it('an error message should be shown when the value of the field is not equal to one of "value, value2"', async () => {
      const handleValid = jest.fn()

      render(
        <TextInputForm
          onValid={handleValid}
          fieldValidate={validator().eq(['value', 'value2']).validate()}
        />
      )

      await userEvent.type(screen.getByPlaceholderText('field'), 'val')
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).not.toBeCalled()

      expect(
        screen.queryByText(
          createMessage(locale.eq, '', {
            constraints: {
              values: ['value', 'value2']
            }
          })
        )
      ).toBeInTheDocument()
    })

    it('display an error message when the value of the field is not equal to field "field2"', async () => {
      const anyRef = ref<any>('field2')
      const handleValid = jest.fn()

      render(
        <TextInputsForm
          onValid={handleValid}
          fieldValidate={validator().eq(anyRef).validate()}
        />
      )

      await userEvent.type(screen.getByPlaceholderText('field'), 'value')
      await userEvent.type(screen.getByPlaceholderText('field2'), 'val')
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).not.toBeCalled()

      expect(
        screen.queryByText(
          createMessage(locale.eq, '', {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: []
            }
          })
        )
      ).toBeInTheDocument()
    })

    it('display an error message when the value of the field is not equal to one of the "field2, field3" fields', async () => {
      const anyRef = ref<any>(['field2', 'field3'])
      const handleValid = jest.fn()

      render(
        <TextInputsForm
          onValid={handleValid}
          fieldValidate={validator().eq(anyRef).validate()}
        />
      )

      await userEvent.type(screen.getByPlaceholderText('field'), 'value')
      await userEvent.type(screen.getByPlaceholderText('field2'), 'ab')
      await userEvent.type(screen.getByPlaceholderText('field3'), 'abc')
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).not.toBeCalled()

      expect(
        screen.queryByText(
          createMessage(locale.eq, '', {
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
