import * as React from 'react'
import validator from '../../fns/validator'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMessage } from '../../utils'
import { getLocale } from '../../hookFormValidator'
import {
  TextInputForm,
  FileInputForm,
  SelectInputForm
} from '../../utils/test/components'

const locale = getLocale()

describe('required.integration', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  describe('✅ valid', () => {
    it('must pass required validation for input type="text"', async () => {
      const handleValid = jest.fn()

      render(
        <TextInputForm
          onValid={handleValid}
          fieldValidate={validator().required().validate()}
        />
      )

      await userEvent.type(screen.getByPlaceholderText('field'), 'value')
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).toBeCalled()
    })

    it('must pass required validation for input type="file"', async () => {
      const handleValid = jest.fn()

      render(
        <FileInputForm
          onValid={handleValid}
          fieldValidate={validator().required().validate()}
        />
      )

      await userEvent.upload(screen.getByPlaceholderText('field'), [
        new File(['content'], 'foo.txt')
      ])
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).toBeCalled()
    })

    it('must pass required validation for <select multiple /> element', async () => {
      const handleValid = jest.fn()

      render(
        <SelectInputForm
          onValid={handleValid}
          fieldValidate={validator().required().validate()}
        />
      )

      await userEvent.selectOptions(screen.getByPlaceholderText('field'), ['1'])
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).toBeCalled()
    })
  })

  describe('❌ invalid', () => {
    it('display the required message when no value is entered', async () => {
      const handleValid = jest.fn()

      render(
        <TextInputForm
          onValid={handleValid}
          fieldValidate={validator().required().validate()}
        />
      )

      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).not.toBeCalled()

      expect(
        screen.getByText(createMessage(locale.required, undefined, {}))
      ).toBeInTheDocument()
    })

    it('display the required message when no file is selected', async () => {
      const handleValid = jest.fn()

      render(
        <FileInputForm
          onValid={handleValid}
          fieldValidate={validator().required().validate()}
        />
      )

      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).not.toBeCalled()

      expect(
        screen.getByText(createMessage(locale.required, undefined, {}))
      ).toBeInTheDocument()
    })

    it('display the required message when no item is selected', async () => {
      const handleValid = jest.fn()

      render(
        <SelectInputForm
          onValid={handleValid}
          fieldValidate={validator().required().validate()}
        />
      )

      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).not.toBeCalled()

      expect(
        screen.getByText(createMessage(locale.required, undefined, {}))
      ).toBeInTheDocument()
    })
  })
})
