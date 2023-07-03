import * as React from 'react'
import ref from '../../fns/ref'
import validator from '../../fns/validator'
import { createMessage } from '../../utils'
import addDays from '../../utils/test/addDays'
import { getLocale } from '../../hookFormValidator'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { TextInputForm, TextInputsForm } from '../../utils/test/components'

const locale = getLocale()

describe('lte.integration', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  describe('✅ valid', () => {
    it('the value of the field must be less than or equal to "5"', async () => {
      const handleValid = jest.fn()

      render(
        <TextInputForm
          onValid={handleValid}
          valueAsNumber={true}
          fieldValidate={validator().lte(5).validate()}
        />
      )

      await userEvent.type(screen.getByPlaceholderText('field'), '5')
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).toBeCalled()
    })

    it('the value of the field must be less than or equal to today', async () => {
      const today = new Date()
      const handleValid = jest.fn()

      render(
        <TextInputForm
          onValid={handleValid}
          valueAsDate={true}
          fieldValidate={validator().lte(today).validate()}
        />
      )

      await userEvent.type(
        screen.getByPlaceholderText('field'),
        today.toISOString()
      )
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).toBeCalled()
    })

    it('the value of the field must be less than or equal to the field named "field2"', async () => {
      const anyRef = ref<any>('field2')
      const handleValid = jest.fn()

      render(
        <TextInputsForm
          onValid={handleValid}
          valueAsNumber={true}
          fieldValidate={validator().lte(anyRef).validate()}
        />
      )

      await userEvent.type(screen.getByPlaceholderText('field'), '4')
      await userEvent.type(screen.getByPlaceholderText('field2'), '4')
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).toBeCalled()
    })

    it('the value of the field value must be less than or equal to each of the fields named "field2, field3"', async () => {
      const anyRef = ref<any>(['field2', 'field3'], 'and')
      const handleValid = jest.fn()

      render(
        <TextInputsForm
          onValid={handleValid}
          valueAsNumber={true}
          fieldValidate={validator().lte(anyRef).validate()}
        />
      )

      await userEvent.type(screen.getByPlaceholderText('field'), '1')
      await userEvent.type(screen.getByPlaceholderText('field2'), '2')
      await userEvent.type(screen.getByPlaceholderText('field3'), '4')
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).toBeCalled()
    })

    it('the value of the field must be less than or equal to one of the fields named "field1, field2"', async () => {
      const anyRef = ref<any>(['field2', 'field3'], 'or')
      const handleValid = jest.fn()

      render(
        <TextInputsForm
          onValid={handleValid}
          valueAsNumber={true}
          fieldValidate={validator().lte(anyRef).validate()}
        />
      )

      await userEvent.type(screen.getByPlaceholderText('field'), '4')
      await userEvent.type(screen.getByPlaceholderText('field2'), '4')
      await userEvent.type(screen.getByPlaceholderText('field3'), '2')
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).toBeCalled()
    })
  })

  describe('❌ invalid', () => {
    it('display an error message when the value is not less than or equal to "5"', async () => {
      const handleValid = jest.fn()

      render(
        <TextInputForm
          onValid={handleValid}
          valueAsNumber={true}
          fieldValidate={validator().lte(5).validate()}
        />
      )

      await userEvent.type(screen.getByPlaceholderText('field'), '6')
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).not.toBeCalled()

      expect(
        screen.queryByText(
          createMessage(locale.lte, '', {
            constraints: {
              values: [5]
            }
          })
        )
      ).toBeInTheDocument()
    })

    it('display an error message if the value is not less than or equal to today', async () => {
      const today = new Date()
      const handleValid = jest.fn()

      render(
        <TextInputForm
          onValid={handleValid}
          valueAsDate={true}
          fieldValidate={validator().lte(today).validate()}
        />
      )

      await userEvent.type(
        screen.getByPlaceholderText('field'),
        addDays(new Date(), 1).toISOString()
      )
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).not.toBeCalled()

      expect(
        screen.queryByText(
          createMessage(locale.lte, '', {
            constraints: {
              values: [today]
            }
          })
        )
      ).toBeInTheDocument()
    })

    it('display an error message if the value is not less than or equal to "field2"', async () => {
      const anyRef = ref<any>('field2')
      const handleValid = jest.fn()

      render(
        <TextInputsForm
          onValid={handleValid}
          valueAsDate={true}
          fieldValidate={validator().lte(anyRef).validate()}
        />
      )

      await userEvent.type(
        screen.getByPlaceholderText('field'),
        addDays(new Date(), 1).toISOString()
      )
      await userEvent.type(
        screen.getByPlaceholderText('field2'),
        new Date().toISOString()
      )
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).not.toBeCalled()

      expect(
        screen.queryByText(
          createMessage(locale.lte, '', {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: []
            }
          })
        )
      ).toBeInTheDocument()
    })

    it('display an error message if the value is not less than or equal to all fields named "field2, field3"', async () => {
      const anyRef = ref<any>(['field2', 'field3'], 'and')
      const handleValid = jest.fn()

      render(
        <TextInputsForm
          onValid={handleValid}
          valueAsDate={true}
          fieldValidate={validator().lte(anyRef).validate()}
        />
      )

      await userEvent.type(
        screen.getByPlaceholderText('field'),
        addDays(new Date(), 2).toISOString()
      )
      await userEvent.type(
        screen.getByPlaceholderText('field2'),
        new Date().toISOString()
      )
      await userEvent.type(
        screen.getByPlaceholderText('field3'),
        addDays(new Date(), 1).toISOString()
      )
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).not.toBeCalled()

      expect(
        screen.queryByText(
          createMessage(locale.lte, '', {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: []
            }
          })
        )
      ).toBeInTheDocument()
    })

    it('display an error message if the value is not less than or equal to one of the fields named "field2, field3"', async () => {
      const anyRef = ref<any>(['field2', 'field2'], 'or')
      const handleValid = jest.fn()

      render(
        <TextInputsForm
          onValid={handleValid}
          valueAsDate={true}
          fieldValidate={validator().lte(anyRef).validate()}
        />
      )

      await userEvent.type(
        screen.getByPlaceholderText('field'),
        addDays(new Date(), 2).toISOString()
      )
      await userEvent.type(
        screen.getByPlaceholderText('field2'),
        addDays(new Date(), 1).toISOString()
      )
      await userEvent.type(
        screen.getByPlaceholderText('field3'),
        new Date().toISOString()
      )
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).not.toBeCalled()

      expect(
        screen.queryByText(
          createMessage(locale.lte, '', {
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
