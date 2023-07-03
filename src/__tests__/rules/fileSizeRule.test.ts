import { fileSizeRule } from '../../rules'
import { getLocale } from '../../hookFormValidator'
import { bytesToSize, createMessage } from '../../utils'
import createFileList from '../../utils/test/createFileList'

const locale = getLocale()

describe('fileSizeRule()', () => {
  it('✅ files size must be less than or equal to 1 MB.', () => {
    const files: File[] = [
      new File(['x'.repeat(1024)], 'foo.txt', {
        type: 'plain/text'
      }),
      new File(['x'.repeat(1024 * 100)], 'foo2.txt', {
        type: 'plain/text'
      }),
      new File(['x'.repeat(1024 ** 2)], 'foo3.txt', {
        type: 'plain/text'
      })
    ]

    const fileList = createFileList(files)
    const validate = fileSizeRule(1024 ** 2, locale, undefined, 1024)

    expect(validate(fileList, {})).toBe(true)
  })

  it('❌ files size should not be larger than 1 MB', () => {
    const files: File[] = [
      new File(['x'.repeat(1025)], 'foo.txt', {
        type: 'plain/text'
      }),
      new File(['x'.repeat(1024 ** 2)], 'foo2.txt', {
        type: 'plain/text'
      }),
      new File(['x'.repeat(1024 ** 2 * 2)], 'foo3.txt', {
        type: 'plain/text'
      })
    ]

    const fileList = createFileList(files)

    // default
    const validate1 = fileSizeRule(1024 ** 2, locale, undefined, 1024)
    // custom message
    const validate2 = fileSizeRule(1024 ** 2, locale, 'custom message', 1024)

    expect(validate1(fileList, {})).toBe(
      createMessage(locale.fileSize, fileList, {
        constraints: {
          formattedSize: bytesToSize(1024 ** 2, 1024)
        }
      })
    )

    expect(validate2(fileList, {})).toBe('custom message')
  })
})
