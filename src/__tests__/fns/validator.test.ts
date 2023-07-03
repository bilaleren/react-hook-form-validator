import ref from '../../fns/ref'
import validator from '../../fns/validator'
import { createMessage } from '../../utils'
import addDays from '../../utils/test/addDays'
import bytesToSize from '../../utils/bytesToSize'
import { getLocale } from '../../hookFormValidator'
import createFileList from '../../utils/test/createFileList'
import generateMockFileList from '../../utils/test/generateMockFileList'

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

describe('validator()', () => {
  describe('clone()', () => {
    it('existing instance should be cloned', () => {
      const instance = validator().string().ip()

      expect(Object.keys(instance.getRules())).toHaveLength(2)
      expect(Object.keys(instance.clone().getRules())).toHaveLength(0)
    })
  })

  describe('✅ valid', () => {
    describe('required()', () => {
      it.each([' ', 'text', 0, 1, -1, {}, [1], NaN, Infinity, -Infinity])(
        'should skip the required check: "%p"',
        (value) => {
          const validate = validator().required().validate()

          expect(validate(value, {})).resolves.toBe(true)
        }
      )
    })

    describe('email()', () => {
      it.each([
        'email@example.com',
        'firstname.lastname@example.com',
        'email@subdomain.example.com',
        'firstname+lastname@example.com',
        'email@123.123.123.123',
        '1234567890@example.com',
        'email@example-one.com',
        '_______@example.com',
        'email@example.name',
        'email@example.museum',
        'email@example.co.jp',
        'firstname-lastname@example.com'
      ])('"%s" must be a valid e-mail address', (value) => {
        const validate = validator().email().validate()

        expect(validate(value, {})).resolves.toBe(true)
      })
    })

    describe('ip()', () => {
      it.each([
        '0.0.0.0',
        '1.1.1.1',
        '0.200.68.100',
        '0.200.68.0',
        '178.16.244.49',
        '248.86.181.149',
        '125.155.74.111',
        '103.1.55.197',
        '202.214.205.160',
        '105.255.109.136'
      ])('"%s" must be a valid IP address', (value) => {
        const validate = validator().ip().validate()

        expect(validate(value, {})).resolves.toBe(true)
      })
    })

    describe('string()', () => {
      it.each(['', 'string'])('"%p" must be a string', (value) => {
        const validate = validator().string().validate()

        expect(validate(value, {})).resolves.toBe(true)
      })
    })

    describe('number()', () => {
      it.each([0, 1, -1, 1.1, -1.1])('"%p" must be a number', (value) => {
        const validate = validator().number().validate()

        expect(validate(value, {})).resolves.toBe(true)
      })
    })

    describe('array()', () => {
      it('"[]" must be a array', () => {
        const validate = validator().array().validate()

        expect(validate([], {})).resolves.toBe(true)
      })

      it('"[1]" must be a array', () => {
        const validate = validator().array().validate()

        expect(validate([1], {})).resolves.toBe(true)
      })
    })

    describe('boolean()', () => {
      it.each([true, false])('"%p" must be a boolean', (value) => {
        const validate = validator().boolean().validate()

        expect(validate(value, {})).resolves.toBe(true)
      })
    })

    describe('fileSize()', () => {
      it('files size must be less than or equal to 1 MB.', () => {
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

        const validate = validator()
          .fileSize(1024 ** 2)
          .validate()

        expect(validate(fileList, {})).resolves.toBe(true)
      })
    })

    describe('fileType()', () => {
      describe('file must be pdf', () => {
        it.each([
          ['application/pdf', pdfFile],
          [['application/pdf'], pdfFile],
          [/^application\/pdf$/, pdfFile]
        ])(
          'The file type must be one of the following: %p',
          (fileType, file) => {
            const fileList = createFileList([file])

            const validate = validator().fileType(fileType).validate()

            expect(validate(fileList, {})).resolves.toBe(true)
          }
        )
      })

      describe('file must be pdf or jpeg', () => {
        it.each([
          [
            ['application/pdf', 'image/jpeg'],
            [pdfFile, jpegFile]
          ],
          [/^(application\/pdf|image\/jpeg)$/, [pdfFile, jpegFile]]
        ])(
          'The file type must be one of the following: %p',
          (fileType, files) => {
            const fileList = createFileList(files)
            const validate = validator().fileType(fileType).validate()

            expect(validate(fileList, {})).resolves.toBe(true)
          }
        )
      })
    })

    describe('length()', () => {
      it('2 characters can be entered', () => {
        const validate = validator().length(2).validate()

        expect(validate('12', {})).resolves.toBe(true)
      })

      it('2 items can be selected', () => {
        const validate = validator().length(2).validate()

        expect(validate([1, 2], {})).resolves.toBe(true)
      })

      it('2 files can be selected', () => {
        const validate = validator().length(2).validate()

        expect(validate(generateMockFileList(2), {})).resolves.toBe(true)
      })
    })

    describe('minLength()', () => {
      it('at least 2 characters must be entered', () => {
        const validate = validator().minLength(2).validate()

        expect(validate('12', {})).resolves.toBe(true)
      })

      it('at least 2 items must be selected', () => {
        const validate = validator().minLength(2).validate()

        expect(validate([1, 2, 3], {})).resolves.toBe(true)
      })

      it('at least 2 files must be selected', () => {
        const validate = validator().minLength(2).validate()

        expect(validate(generateMockFileList(2), {})).resolves.toBe(true)
      })
    })

    describe('maxLength()', () => {
      it('up to 2 characters can be entered', () => {
        const validate = validator().maxLength(2).validate()

        expect(validate('12', {})).resolves.toBe(true)
      })

      it('up to 2 items can be selected', () => {
        const validate = validator().maxLength(2).validate()

        expect(validate([1, 2], {})).resolves.toBe(true)
      })

      it('up to 2 files can be selected', () => {
        const validate = validator().maxLength(2).validate()

        expect(validate(generateMockFileList(2), {})).resolves.toBe(true)
      })
    })

    describe('eq()', () => {
      it('value must be equal to "value"', () => {
        const validate = validator().eq('value').validate()

        expect(validate('value', {})).resolves.toBe(true)
      })

      it('value must be equal to one of "value, value2"', () => {
        const validate = validator().eq(['value', 'value2']).validate()

        expect(validate('value2', {})).resolves.toBe(true)
      })

      it('the value must be equal to the value of the field "field"', () => {
        const validate = validator().eq(ref('field')).validate()

        const formValues = {
          field: 'value'
        }

        expect(validate('value', formValues)).resolves.toBe(true)
      })

      it('the value must be equal to one of the "field1, field2" fields', () => {
        const validate = validator()
          .eq(ref(['field1', 'field2'], 'or'))
          .validate()

        const formValues = {
          field1: 'value',
          field2: 2
        }

        expect(validate(2, formValues)).resolves.toBe(true)
      })

      it('value must be equal to each of the "field1, field2" fields', () => {
        const validate = validator()
          .eq(ref(['field1', 'field2'], 'and'))
          .validate()

        const formValues = {
          field1: 2,
          field2: 2
        }

        expect(validate(2, formValues)).resolves.toBe(true)
      })
    })

    describe('neq()', () => {
      it('value must not be equal to "value"', () => {
        const validate = validator().neq('value').validate()

        expect(validate('value1', {})).resolves.toBe(true)
      })

      it('value must not be equal to one of "value, value2"', () => {
        const validate = validator().neq(['value', 'value2']).validate()

        expect(validate('value3', {})).resolves.toBe(true)
      })

      it('the value must not be equal to the value of the field "field"', () => {
        const validate = validator().neq(ref('field')).validate()
        const formValues = {
          field: 'value1'
        }

        expect(validate('value', formValues)).resolves.toBe(true)
      })

      it('the value must not be equal to one of the "field1, field2" fields', () => {
        const validate = validator()
          .neq(ref(['field1', 'field2']))
          .validate()
        const formValues = {
          field1: 1,
          field2: 2
        }

        expect(validate(3, formValues)).resolves.toBe(true)
      })
    })

    describe('lt()', () => {
      it('value must be less than "5"', () => {
        const validate = validator().lt(5).validate()

        expect(validate(4, {})).resolves.toBe(true)
      })

      it('the value must be less than today', () => {
        const validate = validator().lt(new Date()).validate()

        expect(validate(addDays(new Date(), -1), {})).resolves.toBe(true)
      })

      it('value must be less than the field named "field"', () => {
        const anyRef = ref<any>('field')
        const validate = validator().lt(anyRef).validate()
        const formValues = {
          field: 5
        }

        expect(validate(4, formValues)).resolves.toBe(true)
      })

      it('the value must be less than each of the fields named "field1, field2"', () => {
        const anyRef = ref<any>(['field1', 'field2'], 'and')
        const validate = validator().lt(anyRef).validate()
        const formValues = {
          field1: 5,
          field2: 4
        }

        expect(validate(3, formValues)).resolves.toBe(true)
      })

      it('the value must be less than one of the fields named "field1, field2"', () => {
        const anyRef = ref<any>(['field1', 'field2'], 'or')
        const validate = validator().lt(anyRef).validate()
        const formValues = {
          field1: 5,
          field2: 10
        }

        expect(validate(4, formValues)).resolves.toBe(true)
      })
    })

    describe('lte()', () => {
      it('value must be less than or equal to "5"', () => {
        const validate = validator().lte(5).validate()

        expect(validate(5, {})).resolves.toBe(true)
      })

      it('the value must be less than or equal today', () => {
        const validate = validator().lte(new Date()).validate()

        expect(validate(new Date(), {})).resolves.toBe(true)
      })

      it('value must be less than or equal to the field named "field"', () => {
        const anyRef = ref<any>('field')
        const validate = validator().lte(anyRef).validate()
        const formValues = {
          field: 6
        }

        expect(validate(6, formValues)).resolves.toBe(true)
      })

      it('the value must be less than or equal to each of the fields named "field1, field2"', () => {
        const anyRef = ref<any>(['field1', 'field2'], 'and')
        const validate = validator().lte(anyRef).validate()
        const formValues = {
          field1: 6,
          field2: 7
        }

        expect(validate(6, formValues)).resolves.toBe(true)
      })

      it('the value must be less than or equal to one of the fields named "field1, field2"', () => {
        const anyRef = ref<any>(['field1', 'field2'], 'or')
        const validate = validator().lte(anyRef).validate()
        const formValues = {
          field1: 5,
          field2: 6
        }

        expect(validate(6, formValues)).resolves.toBe(true)
      })
    })

    describe('gt()', () => {
      it('value must be greater than "5"', () => {
        const validate = validator().gt(5).validate()

        expect(validate(6, {})).resolves.toBe(true)
      })

      it('the value must be greater than today', () => {
        const validate = validator().gt(new Date()).validate()

        expect(validate(addDays(new Date(), 1), {})).resolves.toBe(true)
      })

      it('value must be greater than the field named "field"', () => {
        const anyRef = ref<any>('field')
        const validate = validator().gt(anyRef).validate()
        const formValues = {
          field: 5
        }

        expect(validate(6, formValues)).resolves.toBe(true)
      })

      it('the value must be greater than each of the fields named "field1, field2"', () => {
        const anyRef = ref<any>(['field1', 'field2'], 'and')
        const validate = validator().gt(anyRef).validate()
        const formValues = {
          field1: 5,
          field2: 4
        }

        expect(validate(6, formValues)).resolves.toBe(true)
      })

      it('the value must be greater than one of the fields named "field1, field2"', () => {
        const anyRef = ref<any>(['field1', 'field2'], 'or')
        const validate = validator().gt(anyRef).validate()
        const formValues = {
          field1: 5,
          field2: 10
        }

        expect(validate(6, formValues)).resolves.toBe(true)
      })
    })

    describe('gte()', () => {
      it('value must be greater than or equal to "5"', () => {
        const validate = validator().gte(5).validate()

        expect(validate(5, {})).resolves.toBe(true)
      })

      it('the value must be greater than or equal today', () => {
        const validate = validator().gte(new Date()).validate()

        expect(validate(new Date(), {})).resolves.toBe(true)
      })

      it('value must be greater than or equal to the field named "field"', () => {
        const anyRef = ref<any>('field')
        const validate = validator().gte(anyRef).validate()
        const formValues = {
          field: 6
        }

        expect(validate(6, formValues)).resolves.toBe(true)
      })

      it('the value must be greater than or equal to each of the fields named "field1, field2"', () => {
        const anyRef = ref<any>(['field1', 'field2'], 'and')
        const validate = validator().gte(anyRef).validate()
        const formValues = {
          field1: 6,
          field2: 6
        }

        expect(validate(6, formValues)).resolves.toBe(true)
      })

      it('the value must be greater than or equal to one of the fields named "field1, field2"', () => {
        const anyRef = ref<any>(['field1', 'field2'], 'or')
        const validate = validator().gte(anyRef).validate()
        const formValues = {
          field1: 5,
          field2: 6
        }

        expect(validate(6, formValues)).resolves.toBe(true)
      })
    })

    describe('regexp()', () => {
      it.each([
        [/^1$/, '1'],
        [/^[a-z]{2}$/, 'ab'],
        [/^[A-Z]{2}$/, 'AZ'],
        [/^[0-9]{2}$/, '12']
      ])('"%s" pattern must match "%s" value', (regexp, value) => {
        const validate = validator().regexp(regexp).validate()

        expect(validate(value, {})).resolves.toBe(true)
      })
    })

    describe('pattern()', () => {
      // # [0-9]
      it.each([
        ['', ''],
        ['05## ### ####', '0555 222 5555'],
        ['+90 216 ### ## ##', '+90 216 222 55 55'],
        ['+1 (###) ###‑####', '+1 (415) 555‑0132'],
        ['###,##', '500,10'],
        ['###', '546'],
        ['##/##', '01/27'],
        ['###.###,##', '500.150,00'],
        ['####-##-##', '2023-01-01'],
        ['####/##/##', '2023/01/01'],
        ['####.##.##', '2023.01.01']
      ])('"%s" pattern must match "%s" value', (pattern, value) => {
        const validate = validator().pattern(pattern).validate()

        expect(validate(value, {})).resolves.toBe(true)
      })
    })

    describe('by()', () => {
      it('must validate by custom rule', () => {
        const validate = validator()
          .by((value) => value === 'custom' || 'invalid')
          .validate()

        expect(validate('custom', {})).resolves.toBe(true)
      })
    })
  })

  describe('❌ invalid', () => {
    describe('required()', () => {
      it.each(['', null, undefined, []])(
        'should indicate that the value is required: "%p"',
        (value) => {
          const validate = validator().required().validate()

          expect(validate(value, {})).resolves.toBe(locale.required)
        }
      )
    })

    describe('email()', () => {
      it.each([
        0,
        1,
        -1,
        true,
        false,
        [1],
        ' ',
        'plainaddress',
        '#@%^%#$@#$@#.com',
        '@example.com',
        'Joe Smith <email@example.com>',
        'email.example.com',
        'email@example@example.com',
        'あいうえお@example.com',
        'email@example.com (Joe Smith)',
        'email@-example.com',
        'email@example..com',
        '”(),:;<>[]@example.com',
        'just”not”right@example.com',
        'this is"really"notallowed@example.com',
        'much.”more unusual”@example.com',
        'very.unusual.”@”.unusual.com@example.com',
        'very.”(),:;<>[]”.VERY.”very@\\ "very”.unusual@strange.example.com'
      ])('"%s" must be a invalid e-mail address', (value) => {
        const validate = validator().email().validate()

        expect(validate(value, {})).resolves.toBe(locale.email)
      })
    })

    describe('ip()', () => {
      it.each([
        0,
        1,
        -1,
        true,
        false,
        [1],
        ' ',
        '01.0.0.0',
        '010.0.0.0',
        '.0.0.0',
        '0.0.0.',
        '0.0.0',
        '256.150.60.70',
        '256.150.60.25'
      ])('"%s" must be a invalid IP address', (value) => {
        const validate = validator().ip().validate()

        expect(validate(value, {})).resolves.toBe(locale.ipAddress)
      })
    })

    describe('string()', () => {
      it.each([
        0,
        1,
        -1,
        1.1,
        -1.1,
        [1],
        {},
        NaN,
        Infinity,
        -Infinity,
        new Date(),
        () => {}
      ])('"%p" must not be a string', (value) => {
        const validate = validator().string().validate()

        expect(validate(value, {})).resolves.toBe(locale.string)
      })
    })

    describe('number()', () => {
      it.each([
        ' ',
        new Date(),
        [1],
        {},
        () => {},
        true,
        false,
        NaN,
        Infinity,
        -Infinity
      ])('"%p" must not be a number', (value) => {
        const validate = validator().number().validate()

        expect(validate(value, {})).resolves.toBe(locale.number)
      })
    })

    describe('array()', () => {
      it.each([
        ' ',
        '1',
        1,
        0,
        -1,
        1.1,
        -1.1,
        {},
        true,
        false,
        new Date(),
        () => {}
      ])('"%p" must not be a array', (value) => {
        const validate = validator().array().validate()

        expect(validate(value, {})).resolves.toBe(locale.array)
      })
    })

    describe('boolean()', () => {
      it.each([[1], 1, 0, -1, 1.1, -1.1, ' ', {}, () => {}, /1/, new Date()])(
        '"%p" must be not a boolean',
        (value) => {
          const validate = validator().boolean().validate()

          expect(validate(value, {})).resolves.toBe(locale.boolean)
        }
      )
    })

    describe('fileSize()', () => {
      it('files size should not be larger than 1 MB', () => {
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

        const validate = validator()
          .fileSize(1024 ** 2)
          .validate()

        expect(validate(fileList, {})).resolves.toBe(
          createMessage(locale.fileSize, fileList, {
            constraints: {
              size: 1024 ** 2,
              formattedSize: bytesToSize(1024 ** 2, 1024)
            }
          })
        )
      })
    })

    describe('fileType()', () => {
      describe('file must not be pdf', () => {
        it.each([
          ['application/pdf', jpegFile],
          [['application/pdf'], jpegFile],
          [/^application\/pdf$/, jpegFile]
        ])(
          'The file type must not be one of the following: %p',
          (fileType, file) => {
            const fileList = createFileList([file])
            const validate = validator().fileType(fileType).validate()

            expect(validate(fileList, {})).resolves.toBe(
              createMessage(locale.fileType, fileList, {
                constraints: {
                  type: fileType
                }
              })
            )
          }
        )
      })

      describe('file must not be pdf or jpeg', () => {
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
            const validate = validator().fileType(fileType).validate()

            expect(validate(fileList, {})).resolves.toBe(
              createMessage(locale.fileType, fileList, {
                constraints: {
                  type: fileType
                }
              })
            )
          }
        )
      })
    })

    describe('length()', () => {
      it('return an error message if 2 characters are not entered', () => {
        const value = '123'
        const validate1 = validator().length(2).validate()
        const validate2 = validator().length(2, 'custom message').validate()
        const expectedMessage = createMessage(locale['length.string'], value, {
          constraints: {
            length: 2
          }
        })

        expect(validate1(value, {})).resolves.toBe(expectedMessage)
        expect(validate2(value, {})).resolves.toBe('custom message')
      })

      it('return an error message if 2 items are not selected', () => {
        const value = [1, 2, 3]
        const validate1 = validator().length(2).validate()
        const validate2 = validator().length(2, 'custom message').validate()
        const expectedMessage = createMessage(locale['length.array'], value, {
          constraints: {
            length: 2
          }
        })

        expect(validate1(value, {})).resolves.toBe(expectedMessage)
        expect(validate2(value, {})).resolves.toBe('custom message')
      })

      it('return an error message if 2 files are not selected', () => {
        const value = generateMockFileList(3)
        const validate1 = validator().length(2).validate()
        const validate2 = validator().length(2, 'custom message').validate()
        const expectedMessage = createMessage(locale['length.file'], value, {
          constraints: {
            length: 2
          }
        })

        expect(validate1(value, {})).resolves.toBe(expectedMessage)
        expect(validate2(value, {})).resolves.toBe('custom message')
      })
    })

    describe('minLength()', () => {
      it('return an error message if at least 2 characters are not entered', () => {
        const value = 'a'
        const validate1 = validator().minLength(2).validate()
        const validate2 = validator().minLength(2, 'custom message').validate()
        const expectedMessage = createMessage(
          locale['minLength.string'],
          value,
          {
            constraints: {
              length: 2
            }
          }
        )

        expect(validate1(value, {})).resolves.toBe(expectedMessage)
        expect(validate2(value, {})).resolves.toBe('custom message')
      })

      it('return an error message when at least 2 items are not selected', () => {
        const value = [1]
        const validate1 = validator().minLength(2).validate()
        const validate2 = validator().minLength(2, 'custom message').validate()
        const expectedMessage = createMessage(
          locale['minLength.array'],
          value,
          {
            constraints: {
              length: 2
            }
          }
        )

        expect(validate1(value, {})).resolves.toBe(expectedMessage)
        expect(validate2(value, {})).resolves.toBe('custom message')
      })

      it('return an error message when at least 2 files are not selected', () => {
        const value = generateMockFileList(1)
        const validate1 = validator().minLength(2).validate()
        const validate2 = validator().minLength(2, 'custom message').validate()
        const expectedMessage = createMessage(locale['minLength.file'], value, {
          constraints: {
            length: 2
          }
        })

        expect(validate1(value, {})).resolves.toBe(expectedMessage)
        expect(validate2(value, {})).resolves.toBe('custom message')
      })
    })

    describe('maxLength()', () => {
      it('return an error message if more than 2 characters are entered', () => {
        const value = '123'
        const validate1 = validator().maxLength(2).validate()
        const validate2 = validator().maxLength(2, 'custom message').validate()
        const expectedMessage = createMessage(
          locale['maxLength.string'],
          value,
          {
            constraints: {
              length: 2
            }
          }
        )

        expect(validate1(value, {})).resolves.toBe(expectedMessage)
        expect(validate2(value, {})).resolves.toBe('custom message')
      })

      it('return an error message if more than 2 items are selected', () => {
        const value = [1, 2, 3]
        const validate1 = validator().maxLength(2).validate()
        const validate2 = validator().maxLength(2, 'custom message').validate()
        const expectedMessage = createMessage(
          locale['maxLength.array'],
          value,
          {
            constraints: {
              length: 2
            }
          }
        )

        expect(validate1(value, {})).resolves.toBe(expectedMessage)
        expect(validate2(value, {})).resolves.toBe('custom message')
      })

      it('return an error message if more than 2 files are selected', () => {
        const value = generateMockFileList(3)
        const validate1 = validator().maxLength(2).validate()
        const validate2 = validator().maxLength(2, 'custom message').validate()
        const expectedMessage = createMessage(locale['maxLength.file'], value, {
          constraints: {
            length: 2
          }
        })

        expect(validate1(value, {})).resolves.toBe(expectedMessage)
        expect(validate2(value, {})).resolves.toBe('custom message')
      })
    })

    describe('eq()', () => {
      it('returns an error message when the value is not equal to "value"', () => {
        const validate1 = validator<string>().eq('value').validate()
        const validate2 = validator<string>()
          .eq('value', 'custom message')
          .validate()

        expect(validate1('value1', {})).resolves.toBe(
          createMessage(locale.eq, 'value1', {
            constraints: {
              values: ['value']
            }
          })
        )

        expect(validate2('value2', {})).resolves.toBe('custom message')
      })

      it('returns an error message if the value is not equal to one of "value, value2"', () => {
        const validate1 = validator<string>().eq(['value', 'value2']).validate()
        const validate2 = validator<string>()
          .eq(['value', 'value2'], 'custom message')
          .validate()

        expect(validate1('value3', {})).resolves.toBe(
          createMessage(locale.eq, 'value3', {
            constraints: {
              values: ['value', 'value2']
            }
          })
        )

        expect(validate2('value4', {})).resolves.toBe('custom message')
      })

      it('returns an error message when the value is not equal to named field "field"', () => {
        const anyRef = ref<any>('field')
        const validate1 = validator().eq(anyRef).validate()
        const validate2 = validator().eq(anyRef, 'custom message').validate()

        const formValues = {
          field: 'value'
        }

        expect(validate1('value1', formValues)).resolves.toBe(
          createMessage(locale.eq, 'value1', {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2('value1', formValues)).resolves.toBe('custom message')
      })

      it('returns an error message if the value is not equal to one of the fields named "field1, field2"', () => {
        const anyRef = ref<any>(['field1', 'field2'], 'or')
        const validate1 = validator().eq(anyRef).validate()
        const validate2 = validator().eq(anyRef, 'custom message').validate()
        const formValues = {
          field1: 'value',
          field2: 1
        }

        expect(validate1(2, formValues)).resolves.toBe(
          createMessage(locale.eq, 2, {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2(2, formValues)).resolves.toBe('custom message')
      })

      it('returns an error message if the value is not equal to each of the fields named "field1, field2"', () => {
        const anyRef = ref<any>(['field1', 'field2'], 'and')
        const validate1 = validator().eq(anyRef).validate()
        const validate2 = validator().eq(anyRef, 'custom message').validate()

        const formValues = {
          field1: 3,
          field2: 1
        }

        expect(validate1(2, formValues)).resolves.toBe(
          createMessage(locale.eq, 2, {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2(2, formValues)).resolves.toBe('custom message')
      })
    })

    describe('neq()', () => {
      it('returns an error message when the value is equal to "value"', () => {
        const validate1 = validator().neq('value').validate()
        const validate2 = validator().neq('value', 'custom message').validate()

        expect(validate1('value', {})).resolves.toBe(
          createMessage(locale.neq, 'value', {
            constraints: {
              values: ['value']
            }
          })
        )

        expect(validate2('value', {})).resolves.toBe('custom message')
      })

      it('returns an error message if the value is equal to one of "value, value2"', () => {
        const validate1 = validator().neq(['value', 'value2']).validate()
        const validate2 = validator()
          .neq(['value', 'value2'], 'custom message')
          .validate()

        expect(validate1('value2', {})).resolves.toBe(
          createMessage(locale.neq, 'value2', {
            constraints: {
              values: ['value', 'value2']
            }
          })
        )

        expect(validate2('value', {})).resolves.toBe('custom message')
      })

      it('returns an error message when the value is equal to named field "field"', () => {
        const anyRef = ref<any>('field')
        const validate1 = validator().neq(anyRef).validate()
        const validate2 = validator().neq(anyRef, 'custom message').validate()

        const formValues = {
          field: 'value'
        }

        expect(validate1('value', formValues)).resolves.toBe(
          createMessage(locale.neq, 'value', {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2('value', formValues)).resolves.toBe('custom message')
      })

      it('returns an error message if the value is equal to one of the fields named "field1, field2"', () => {
        const anyRef = ref<any>(['field1', 'field2'])
        const validate1 = validator().neq(anyRef).validate()
        const validate2 = validator().neq(anyRef, 'custom message').validate()

        const formValues = {
          field1: 'value',
          field2: 2
        }

        expect(validate1(2, formValues)).resolves.toBe(
          createMessage(locale.neq, 2, {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2(2, formValues)).resolves.toBe('custom message')
      })
    })

    describe('lt()', () => {
      it('returns an error message when the value is not less than "5"', () => {
        const validate1 = validator().lt(5).validate()
        const validate2 = validator().lt(5, 'custom message').validate()

        expect(validate1(5, {})).resolves.toBe(
          createMessage(locale.lt, 5, {
            constraints: {
              values: [5]
            }
          })
        )

        expect(validate2(5, {})).resolves.toBe('custom message')
      })

      it('returns an error message if the value is not less than today', () => {
        const validate1 = validator().lt(new Date()).validate()
        const validate2 = validator()
          .lt(new Date(), 'custom message')
          .validate()

        expect(validate1(addDays(new Date(), 1), {})).resolves.toBe(
          createMessage(locale.lt, addDays(new Date(), 1), {
            constraints: {
              values: [new Date()]
            }
          })
        )

        expect(validate2(addDays(new Date(), 1), {})).resolves.toBe(
          'custom message'
        )
      })

      it('returns an error message if the value is not less than "field"', () => {
        const anyRef = ref<any>('field')
        const validate1 = validator().lt(anyRef).validate()
        const validate2 = validator().lt(anyRef, 'custom message').validate()
        const formValues = {
          field: 7
        }

        expect(validate1(8, formValues)).resolves.toBe(
          createMessage(locale.lt, 8, {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2(8, formValues)).resolves.toBe('custom message')
      })

      it('returns an error message if the value is not less than all fields named "field1, field2"', () => {
        const anyRef = ref<any>(['field1', 'field2'], 'and')
        const validate1 = validator().lt(anyRef).validate()
        const validate2 = validator().lt(anyRef, 'custom message').validate()
        const formValues = {
          field1: 7,
          field2: 8
        }

        expect(validate1(9, formValues)).resolves.toBe(
          createMessage(locale.lt, 9, {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2(9, formValues)).resolves.toBe('custom message')
      })

      it('returns an error message if the value is not less than one of the fields named "field1, field2"', () => {
        const anyRef = ref<any>(['field1', 'field2'], 'or')
        const validate1 = validator().lt(anyRef).validate()
        const validate2 = validator().lt(anyRef, 'custom message').validate()
        const formValues = {
          field1: 7,
          field2: 8
        }

        expect(validate1(8, formValues)).resolves.toBe(
          createMessage(locale.lt, 8, {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2(8, formValues)).resolves.toBe('custom message')
      })
    })

    describe('lte()', () => {
      it('returns an error message when the value is not less than or equal to "5"', () => {
        const validate1 = validator().lte(5).validate()
        const validate2 = validator().lte(5, 'custom message').validate()

        expect(validate1(6, {})).resolves.toBe(
          createMessage(locale.lte, 6, {
            constraints: {
              values: [5]
            }
          })
        )

        expect(validate2(6, {})).resolves.toBe('custom message')
      })

      it('returns an error message if the value is not less than or equal to today', () => {
        const validate1 = validator().lte(new Date()).validate()
        const validate2 = validator()
          .lte(new Date(), 'custom message')
          .validate()

        expect(validate1(addDays(new Date(), 1), {})).resolves.toBe(
          createMessage(locale.lte, addDays(new Date(), 1), {
            constraints: {
              values: [new Date()]
            }
          })
        )

        expect(validate2(addDays(new Date(), 1), {})).resolves.toBe(
          'custom message'
        )
      })

      it('returns an error message if the value is not less than or equal to "field"', () => {
        const anyRef = ref<any>('field')
        const validate1 = validator().lte(anyRef).validate()
        const validate2 = validator().lte(anyRef, 'custom message').validate()
        const formValues = {
          field: 7
        }

        expect(validate1(8, formValues)).resolves.toBe(
          createMessage(locale.lte, 8, {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2(8, formValues)).resolves.toBe('custom message')
      })

      it('returns an error message if the value is not less than or equal to all fields named "field1, field2"', () => {
        const anyRef = ref<any>(['field1', 'field2'], 'and')
        const validate1 = validator().lte(anyRef).validate()
        const validate2 = validator().lte(anyRef, 'custom message').validate()
        const formValues = {
          field1: 7,
          field2: 6
        }

        expect(validate1(7, formValues)).resolves.toBe(
          createMessage(locale.lte, 7, {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2(7, formValues)).resolves.toBe('custom message')
      })

      it('returns an error message if the value is not less than or equal to one of the fields named "field1, field2"', () => {
        const anyRef = ref<any>(['field1', 'field2'], 'or')
        const validate1 = validator().lte(anyRef).validate()
        const validate2 = validator().lte(anyRef, 'custom message').validate()
        const formValues = {
          field1: 7,
          field2: 8
        }

        expect(validate1(9, formValues)).resolves.toBe(
          createMessage(locale.lte, 9, {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2(9, formValues)).resolves.toBe('custom message')
      })
    })

    describe('gt()', () => {
      it('returns an error message when the value is not greater than "5"', () => {
        const validate1 = validator().gt(5).validate()
        const validate2 = validator().gt(5, 'custom message').validate()

        expect(validate1(5, {})).resolves.toBe(
          createMessage(locale.gt, 5, {
            constraints: {
              values: [5]
            }
          })
        )

        expect(validate2(5, {})).resolves.toBe('custom message')
      })

      it('returns an error message if the value is not greater than today', () => {
        const validate1 = validator().gt(new Date()).validate()
        const validate2 = validator()
          .gt(new Date(), 'custom message')
          .validate()

        expect(validate1(addDays(new Date(), -1), {})).resolves.toBe(
          createMessage(locale.gt, addDays(new Date(), -1), {
            constraints: {
              values: [new Date()]
            }
          })
        )

        expect(validate2(addDays(new Date(), -1), {})).resolves.toBe(
          'custom message'
        )
      })

      it('returns an error message if the value is not greater than "field"', () => {
        const anyRef = ref<any>('field')
        const validate1 = validator().gt(anyRef).validate()
        const validate2 = validator().gt(anyRef, 'custom message').validate()
        const formValues = {
          field: 7
        }

        expect(validate1(6, formValues)).resolves.toBe(
          createMessage(locale.gt, 6, {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2(7, formValues)).resolves.toBe('custom message')
      })

      it('returns an error message if the value is not greater than all fields named "field1, field2"', () => {
        const anyRef = ref<any>(['field1', 'field2'], 'and')
        const validate1 = validator().gt(anyRef).validate()
        const validate2 = validator().gt(anyRef, 'custom message').validate()
        const formValues = {
          field1: 7,
          field2: 8
        }

        expect(validate1(6, formValues)).resolves.toBe(
          createMessage(locale.gt, 6, {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2(7, formValues)).resolves.toBe('custom message')
      })

      it('returns an error message if the value is not greater than one of the fields named "field1, field2"', () => {
        const anyRef = ref<any>(['field1', 'field2'], 'or')
        const validate1 = validator().gt(anyRef).validate()
        const validate2 = validator().gt(anyRef, 'custom message').validate()
        const formValues = {
          field1: 7,
          field2: 8
        }

        expect(validate1(6, formValues)).resolves.toBe(
          createMessage(locale.gt, 6, {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2(7, formValues)).resolves.toBe('custom message')
      })
    })

    describe('gte()', () => {
      it('returns an error message when the value is not greater than or equal to "5"', () => {
        const validate1 = validator().gte(5).validate()
        const validate2 = validator().gte(5, 'custom message').validate()

        expect(validate1(4, {})).resolves.toBe(
          createMessage(locale.gte, 4, {
            constraints: {
              values: [5]
            }
          })
        )

        expect(validate2(4, {})).resolves.toBe('custom message')
      })

      it('returns an error message if the value is not greater than or equal to today', () => {
        const validate1 = validator().gte(new Date()).validate()
        const validate2 = validator()
          .gte(new Date(), 'custom message')
          .validate()

        expect(validate1(addDays(new Date(), -1), {})).resolves.toBe(
          createMessage(locale.gte, addDays(new Date(), -1), {
            constraints: {
              values: [new Date()]
            }
          })
        )

        expect(validate2(addDays(new Date(), -1), {})).resolves.toBe(
          'custom message'
        )
      })

      it('returns an error message if the value is not greater than or equal to "field"', () => {
        const anyRef = ref<any>('field')
        const validate1 = validator().gte(anyRef).validate()
        const validate2 = validator().gte(anyRef, 'custom message').validate()
        const formValues = {
          field: 7
        }

        expect(validate1(6, formValues)).resolves.toBe(
          createMessage(locale.gte, 6, {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2(6, formValues)).resolves.toBe('custom message')
      })

      it('returns an error message if the value is not greater than or equal to all fields named "field1, field2"', () => {
        const anyRef = ref<any>(['field1', 'field2'], 'and')
        const validate1 = validator().gte(anyRef).validate()
        const validate2 = validator().gte(anyRef, 'custom message').validate()
        const formValues = {
          field1: 7,
          field2: 6
        }

        expect(validate1(6, formValues)).resolves.toBe(
          createMessage(locale.gte, 6, {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2(6, formValues)).resolves.toBe('custom message')
      })

      it('returns an error message if the value is not greater than or equal to one of the fields named "field1, field2"', () => {
        const anyRef = ref<any>(['field1', 'field2'], 'or')
        const validate1 = validator().gte(anyRef).validate()
        const validate2 = validator().gte(anyRef, 'custom message').validate()
        const formValues = {
          field1: 7,
          field2: 8
        }

        expect(validate1(6, formValues)).resolves.toBe(
          createMessage(locale.gte, 6, {
            ref: anyRef,
            constraints: {
              fields: anyRef.getPaths(),
              resolved: anyRef.resolveValues(formValues)
            }
          })
        )

        expect(validate2(6, formValues)).resolves.toBe('custom message')
      })
    })

    describe('regexp()', () => {
      it.each([
        [/^1$/, '21'],
        [/^[a-z]{2}$/, 'AZ'],
        [/^[A-Z]{2}$/, 'az'],
        [/^[0-9]{2}$/, 'a']
      ])('"%s" pattern must not match "%s" value', (regexp, value) => {
        const validate = validator().regexp(regexp).validate()

        expect(validate(value, {})).resolves.toBe(
          createMessage(locale.regexp, value, {
            constraints: {
              regexp
            }
          })
        )
      })
    })

    describe('pattern()', () => {
      // # [0-9]
      it.each([
        ['05## ### ####', '0 555 222 5555'],
        ['+90 216 ### ## ##', '90 216 222 55 55'],
        ['+1 (###) ###‑####', '+1(415) 555‑0132'],
        ['###,##', '50010'],
        ['###', '22'],
        ['##/##', '2/29'],
        ['###.###,##', '500.150,0'],
        ['####-##-##', '2023-0101'],
        ['####/##/##', '2023/01/1'],
        ['####.##.##', '2023.0101']
      ])('"%s" pattern must not match "%s" value', (pattern, value) => {
        const validate = validator().pattern(pattern).validate()

        expect(validate(value, {})).resolves.toBe(
          createMessage(locale.pattern, value, {
            constraints: {
              pattern
            }
          })
        )
      })
    })

    describe('by()', () => {
      it('must not validate by custom rule', () => {
        const validate = validator()
          .by((value) => value === 'custom' || 'invalid')
          .validate()

        expect(validate('custom1', {})).resolves.toBe('invalid')
      })
    })
  })
})
