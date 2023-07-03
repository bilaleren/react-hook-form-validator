import { fileTypeRule } from '../../rules'
import { createMessage } from '../../utils'
import { getLocale } from '../../hookFormValidator'
import createFileList from '../../utils/test/createFileList'

const locale = getLocale()

const zipFile = new File(['zip file'], 'foo.zip', {
  type: 'application/zip'
})

const textFile = new File(['text file'], 'foo.txt', {
  type: 'plain/text'
})

const pdfFile = new File(['pdf file'], 'foo.pdf', {
  type: 'application/pdf'
})

const jpegFile = new File(['jpeg file'], 'foo.jpeg', {
  type: 'image/jpeg'
})

describe('fileTypeRule()', () => {
  describe('✅ file must be pdf', () => {
    it.each([
      ['application/pdf', pdfFile],
      [['application/pdf'], pdfFile],
      [/^application\/pdf$/, pdfFile]
    ])('The file type must be one of the following: %p', (fileType, file) => {
      const fileList = createFileList([file])
      const validate = fileTypeRule(fileType, locale)

      expect(validate(fileList, {})).toBe(true)
    })
  })

  describe('✅ file must be pdf or jpeg', () => {
    it.each([
      [
        ['application/pdf', 'image/jpeg'],
        [pdfFile, jpegFile]
      ],
      [/^(application\/pdf|image\/jpeg)$/, [pdfFile, jpegFile]]
    ])('The file type must be one of the following: %p', (fileType, files) => {
      const fileList = createFileList(files)
      const validate = fileTypeRule(fileType, locale)

      expect(validate(fileList, {})).toBe(true)
    })
  })

  describe('❌ file must not be pdf', () => {
    it.each([
      ['application/pdf', jpegFile],
      [['application/pdf'], jpegFile],
      [/^application\/pdf$/, jpegFile]
    ])(
      'The file type must not be one of the following: %p',
      (fileType, file) => {
        const fileList = createFileList([file])

        // default
        const validate1 = fileTypeRule(fileType, locale)
        // custom message
        const validate2 = fileTypeRule(fileType, locale, 'custom message')

        expect(validate1(fileList, {})).toBe(
          createMessage(locale.fileType, fileList, {
            constraints: {
              type: fileType
            }
          })
        )

        expect(validate2(fileList, {})).toBe('custom message')
      }
    )
  })

  describe('❌ file must not be pdf or jpeg', () => {
    it.each([
      ['application/pdf', [textFile, zipFile]],
      [
        ['application/pdf', 'image/jpeg'],
        [textFile, zipFile]
      ],
      [/^(application\/pdf|image\/jpeg)$/, [textFile, zipFile]]
    ])(
      'The file type must not be one of the following: %p',
      (fileType, files) => {
        const fileList = createFileList(files)

        // default
        const validate1 = fileTypeRule(fileType, locale)
        // custom message
        const validate2 = fileTypeRule(fileType, locale, 'custom message')

        expect(validate1(fileList, {})).toBe(
          createMessage(locale.fileType, fileList, {
            constraints: {
              type: fileType
            }
          })
        )

        expect(validate2(fileList, {})).toBe('custom message')
      }
    )
  })
})
