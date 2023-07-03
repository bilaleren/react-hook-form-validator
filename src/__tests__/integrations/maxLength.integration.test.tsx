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

describe('maxLength.integration', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  describe('✅ valid', () => {
    it('up to 2 characters can be entered in the field', async () => {
      const handleValid = jest.fn()

      render(
        <TextInputForm
          onValid={handleValid}
          fieldValidate={validator().maxLength(2).validate()}
        />
      )

      await userEvent.type(screen.getByPlaceholderText('field'), 'va')
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).toBeCalled()
    })

    it('up to 2 items can be selected', async () => {
      const handleValid = jest.fn()

      render(
        <SelectInputForm
          onValid={handleValid}
          fieldValidate={validator().maxLength(2).validate()}
        />
      )

      await userEvent.selectOptions(screen.getByPlaceholderText('field'), [
        '1',
        '2'
      ])
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).toBeCalled()
    })

    it('up to 2 files can be selected', async () => {
      const handleValid = jest.fn()

      render(
        <FileInputForm
          onValid={handleValid}
          fieldValidate={validator().maxLength(2).validate()}
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
    it('display an error message if more than 2 characters are entered in the field', async () => {
      const handleValid = jest.fn()

      render(
        <TextInputForm
          onValid={handleValid}
          fieldValidate={validator().maxLength(2).validate()}
        />
      )

      await userEvent.type(screen.getByPlaceholderText('field'), 'val')
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).not.toBeCalled()

      expect(
        screen.queryByText(
          createMessage(locale['maxLength.string'], '', {
            constraints: {
              length: 2
            }
          })
        )
      ).toBeInTheDocument()
    })

    it('display an error message if more than 2 items are selected', async () => {
      const handleValid = jest.fn()

      render(
        <SelectInputForm
          onValid={handleValid}
          fieldValidate={validator().maxLength(2).validate()}
        />
      )

      await userEvent.selectOptions(screen.getByPlaceholderText('field'), [
        '1',
        '2',
        '3'
      ])
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).not.toBeCalled()

      expect(
        screen.queryByText(
          createMessage(locale['maxLength.array'], '', {
            constraints: {
              length: 2
            }
          })
        )
      ).toBeInTheDocument()
    })

    it('display an error message if more than 2 files are selected', async () => {
      const handleValid = jest.fn()

      render(
        <FileInputForm
          onValid={handleValid}
          fieldValidate={validator().maxLength(2).validate()}
        />
      )

      await userEvent.upload(screen.getByPlaceholderText('field'), [
        new File([], 'foo.txt'),
        new File([], 'foo2.txt'),
        new File([], 'foo3.txt')
      ])
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).not.toBeCalled()

      expect(
        screen.queryByText(
          createMessage(locale['maxLength.file'], '', {
            constraints: {
              length: 2
            }
          })
        )
      ).toBeInTheDocument()
    })
  })
})
