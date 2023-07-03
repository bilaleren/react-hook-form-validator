import * as React from 'react'
import validator from '../../fns/validator'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { getLocale } from '../../hookFormValidator'
import { bytesToSize, createMessage } from '../../utils'
import { FileInputForm } from '../../utils/test/components'

const locale = getLocale()

describe('fileSize.integration', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  describe('✅ valid', () => {
    it('all selected files must be no more than 1mb in size', async () => {
      const handleValid = jest.fn()

      render(
        <FileInputForm
          onValid={handleValid}
          fieldValidate={validator()
            .fileSize(1000 ** 2)
            .validate()}
        />
      )

      await userEvent.upload(screen.getByPlaceholderText('field'), [
        new File(['content'], 'foo.txt'),
        new File(['x'.repeat(1000 ** 2)], 'foo2.txt')
      ])
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).toBeCalled()
    })
  })

  describe('❌ invalid', () => {
    it('an error message should appear if the selected files exceed the file size of 1mb', async () => {
      const handleValid = jest.fn()

      render(
        <FileInputForm
          onValid={handleValid}
          fieldValidate={validator()
            .fileSize(1000 ** 2)
            .validate()}
        />
      )

      await userEvent.upload(screen.getByPlaceholderText('field'), [
        new File(['content'], 'foo.txt'),
        new File(['x'.repeat(1001 ** 2)], 'foo2.txt')
      ])
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).not.toBeCalled()

      expect(
        screen.queryByText(
          createMessage(locale.fileSize, '', {
            constraints: {
              size: 1001 ** 2,
              formattedSize: bytesToSize(1000 ** 2)
            }
          })
        )
      ).toBeInTheDocument()
    })
  })
})
