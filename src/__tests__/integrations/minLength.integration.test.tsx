import * as React from 'react'
import validator from '../../fns/validator'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { getLocale } from '../../hookFormValidator'
import { createMessage } from '../../utils'
import {
  FileInputForm,
  TextInputForm,
  SelectInputForm
} from '../../utils/test/components'

const locale = getLocale()

describe('minLength.integration', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  describe('✅ valid', () => {
    it('at least 2 characters must be entered in the field', async () => {
      const handleValid = jest.fn()

      render(
        <TextInputForm
          onValid={handleValid}
          fieldValidate={validator().minLength(2).validate()}
        />
      )

      await userEvent.type(screen.getByPlaceholderText('field'), 'value')
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).toBeCalled()
    })

    it('at least 2 items must be selected', async () => {
      const handleValid = jest.fn()

      render(
        <SelectInputForm
          onValid={handleValid}
          fieldValidate={validator().minLength(2).validate()}
        />
      )

      await userEvent.selectOptions(screen.getByPlaceholderText('field'), [
        '1',
        '2'
      ])
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).toBeCalled()
    })

    it('at least 2 files must be selected', async () => {
      const handleValid = jest.fn()

      render(
        <FileInputForm
          onValid={handleValid}
          fieldValidate={validator().minLength(2).validate()}
        />
      )

      await userEvent.upload(screen.getByPlaceholderText('field'), [
        new File([], 'foo.txt'),
        new File([], 'foo2.txt')
      ])
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).toBeCalled()
    })
  })

  describe('❌ invalid', () => {
    it('display an error message if at least 2 characters are not entered in the field', async () => {
      const handleValid = jest.fn()

      render(
        <TextInputForm
          onValid={handleValid}
          fieldValidate={validator().minLength(2).validate()}
        />
      )

      await userEvent.type(screen.getByPlaceholderText('field'), 'v')
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).not.toBeCalled()

      expect(
        screen.queryByText(
          createMessage(locale['minLength.string'], '', {
            constraints: {
              length: 2
            }
          })
        )
      ).toBeInTheDocument()
    })

    it('display an error message when at least 2 items are not selected', async () => {
      const handleValid = jest.fn()

      render(
        <SelectInputForm
          onValid={handleValid}
          fieldValidate={validator().minLength(2).validate()}
        />
      )

      await userEvent.selectOptions(screen.getByPlaceholderText('field'), ['1'])
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).not.toBeCalled()

      expect(
        screen.queryByText(
          createMessage(locale['minLength.array'], '', {
            constraints: {
              length: 2
            }
          })
        )
      ).toBeInTheDocument()
    })

    it('display an error message when at least 2 files are not selected', async () => {
      const handleValid = jest.fn()

      render(
        <FileInputForm
          onValid={handleValid}
          fieldValidate={validator().minLength(2).validate()}
        />
      )

      await userEvent.upload(screen.getByPlaceholderText('field'), [
        new File([], 'foo.txt')
      ])
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).not.toBeCalled()

      expect(
        screen.queryByText(
          createMessage(locale['minLength.file'], '', {
            constraints: {
              length: 2
            }
          })
        )
      ).toBeInTheDocument()
    })
  })
})
