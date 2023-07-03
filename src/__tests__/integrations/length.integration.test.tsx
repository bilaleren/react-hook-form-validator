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
import generateMockFileList from '../../utils/test/generateMockFileList'

const locale = getLocale()

describe('length.integration', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  describe('✅ valid', () => {
    it('2 characters can be entered in the field', async () => {
      const handleValid = jest.fn()

      render(
        <TextInputForm
          onValid={handleValid}
          fieldValidate={validator().length(2).validate()}
        />
      )

      await userEvent.type(screen.getByPlaceholderText('field'), 'va')
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).toBeCalled()
    })

    it('2 items can be selected', async () => {
      const handleValid = jest.fn()

      render(
        <SelectInputForm
          onValid={handleValid}
          fieldValidate={validator().length(2).validate()}
        />
      )

      await userEvent.selectOptions(screen.getByPlaceholderText('field'), [
        '1',
        '2'
      ])
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).toBeCalled()
    })

    it('2 files can be selected', async () => {
      const handleValid = jest.fn()

      render(
        <FileInputForm
          onValid={handleValid}
          fieldValidate={validator().length(2).validate()}
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
    it('display an error message if 2 characters are not entered in the field', async () => {
      const value = 'val'
      const handleValid = jest.fn()

      render(
        <TextInputForm
          onValid={handleValid}
          fieldValidate={validator().length(2).validate()}
        />
      )

      await userEvent.type(screen.getByPlaceholderText('field'), value)
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).not.toBeCalled()

      expect(
        screen.queryByText(
          createMessage(locale['length.string'], value, {
            constraints: {
              length: 2
            }
          })
        )
      ).toBeInTheDocument()
    })

    it('display an error message if 2 items are not selected', async () => {
      const values: string[] = ['1']
      const handleValid = jest.fn()

      render(
        <SelectInputForm
          onValid={handleValid}
          fieldValidate={validator().length(2).validate()}
        />
      )

      await userEvent.selectOptions(
        screen.getByPlaceholderText('field'),
        values
      )
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).not.toBeCalled()

      expect(
        screen.queryByText(
          createMessage(locale['length.array'], values, {
            constraints: {
              length: 2
            }
          })
        )
      ).toBeInTheDocument()
    })

    it('display an error message if 2 items are not selected', async () => {
      const fileList = generateMockFileList(3)
      const handleValid = jest.fn()

      render(
        <FileInputForm
          onValid={handleValid}
          fieldValidate={validator().length(2).validate()}
        />
      )

      await userEvent.upload(
        screen.getByPlaceholderText('field'),
        Array.from(fileList)
      )
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).not.toBeCalled()

      expect(
        screen.queryByText(
          createMessage(locale['length.file'], fileList, {
            constraints: {
              length: 2
            }
          })
        )
      ).toBeInTheDocument()
    })
  })
})
