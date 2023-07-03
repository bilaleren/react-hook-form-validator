import * as React from 'react'
import validator from '../../fns/validator'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { getLocale } from '../../hookFormValidator'
import { createMessage } from '../../utils'
import { FileInputForm } from '../../utils/test/components'

const locale = getLocale()

describe('fileType.integration', () => {
  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  describe('✅ valid', () => {
    it('all selected files must have type "application/pdf"', async () => {
      const handleValid = jest.fn()

      render(
        <FileInputForm
          onValid={handleValid}
          fieldValidate={validator().fileType('application/pdf').validate()}
        />
      )

      await userEvent.upload(screen.getByPlaceholderText('field'), [
        new File(['content'], 'foo.pdf', {
          type: 'application/pdf'
        }),
        new File(['content'], 'foo2.pdf', {
          type: 'application/pdf'
        })
      ])
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).toBeCalled()
    })

    it('the type of all selected files must be one of "image/jpeg, image/png"', async () => {
      const handleValid = jest.fn()

      render(
        <FileInputForm
          onValid={handleValid}
          fieldValidate={validator()
            .fileType(['image/jpeg', 'image/png'])
            .validate()}
        />
      )

      await userEvent.upload(screen.getByPlaceholderText('field'), [
        new File(['content'], 'foo.jpeg', {
          type: 'image/jpeg'
        }),
        new File(['content'], 'foo2.png', {
          type: 'image/png'
        })
      ])
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).toBeCalled()
    })

    it('the type of all selected files must match "/^image/(png|jpeg)$/"', async () => {
      const handleValid = jest.fn()

      render(
        <FileInputForm
          onValid={handleValid}
          fieldValidate={validator()
            .fileType(/^image\/(png|jpeg)$/)
            .validate()}
        />
      )

      await userEvent.upload(screen.getByPlaceholderText('field'), [
        new File(['content'], 'foo.jpeg', {
          type: 'image/jpeg'
        }),
        new File(['content'], 'foo2.png', {
          type: 'image/png'
        })
      ])
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).toBeCalled()
    })
  })

  describe('❌ invalid', () => {
    it('error message should be shown when the type of selected files is not "application/pdf"', async () => {
      const handleValid = jest.fn()

      render(
        <FileInputForm
          onValid={handleValid}
          fieldValidate={validator().fileType('application/pdf').validate()}
        />
      )

      await userEvent.upload(screen.getByPlaceholderText('field'), [
        new File([], 'foo.jpeg', {
          type: 'image/jpeg'
        }),
        new File([], 'foo2.png', {
          type: 'image/png'
        })
      ])
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).not.toBeCalled()

      expect(
        screen.queryByText(
          createMessage(locale.fileType, '', {
            constraints: {
              type: 'application/pdf'
            }
          })
        )
      ).toBeInTheDocument()
    })

    it('an error message should be shown when the type of the selected files is not one of "image/jpeg, image/png"', async () => {
      const handleValid = jest.fn()

      render(
        <FileInputForm
          onValid={handleValid}
          fieldValidate={validator()
            .fileType(['image/jpeg', 'image/png'])
            .validate()}
        />
      )

      await userEvent.upload(screen.getByPlaceholderText('field'), [
        new File([], 'foo.zip', {
          type: 'application/zip'
        }),
        new File([], 'foo2.pdf', {
          type: 'application/pdf'
        })
      ])
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).not.toBeCalled()

      expect(
        screen.queryByText(
          createMessage(locale.fileType, '', {
            constraints: {
              type: ['image/jpeg', 'image/png']
            }
          })
        )
      ).toBeInTheDocument()
    })

    it('an error message should be shown when the type of the selected files does not match "/^image/(png|jpeg)$/"', async () => {
      const handleValid = jest.fn()

      render(
        <FileInputForm
          onValid={handleValid}
          fieldValidate={validator()
            .fileType(/^image\/(png|jpeg)$/)
            .validate()}
        />
      )

      await userEvent.upload(screen.getByPlaceholderText('field'), [
        new File([], 'foo.zip', {
          type: 'application/zip'
        }),
        new File([], 'foo2.pdf', {
          type: 'application/pdf'
        })
      ])
      await userEvent.click(screen.getByText(/submit/i))

      expect(handleValid).not.toBeCalled()

      expect(
        screen.queryByText(
          createMessage(locale.fileType, '', {
            constraints: {
              type: /^image\/(png|jpeg)$/
            }
          })
        )
      ).toBeInTheDocument()
    })
  })
})
