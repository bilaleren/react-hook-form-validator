import isDateString from '../../utils/isDateString'

describe('isDateString()', () => {
  describe('hours must be between 00 and 23 and minutes must be between 00 and 59', () => {
    describe('✅ valid', () => {
      it.each([
        '2023-01-01T00:00',
        '2023-01-01T23:59',
        '2023-01-01T23:00',
        '2023-01-01T00:59'
      ])('"%s" must be invalid', (value) => {
        expect(isDateString(value)).toBe(true)
      })
    })

    describe('❌ invalid', () => {
      it.each([
        '2023-01-01T0:0',
        '2023-01-01T',
        '2023-01-01T23',
        '2023-01-01T0159',
        '2023-01-01T01:0',
        '2023-01-01T0:01',
        '2023-01-01T01:60',
        '2023-01-01T24:59'
      ])('"%s" must be invalid', (value) => {
        expect(isDateString(value)).toBe(false)
      })
    })
  })

  describe('The year must have 4 digits, the month must be between 01 and 12, and the day must be between 01 and 31', () => {
    describe('✅ valid', () => {
      it.each(['2023-01-01', '2023-12-31', '2023-09-01'])(
        '"%s" must be valid',
        (value) => {
          expect(isDateString(value)).toBe(true)
        }
      )
    })

    describe('❌ invalid', () => {
      it.each([
        '0023-01-01',
        '223-01-01',
        '2023-0-0',
        '2023-1-1',
        '2023-01-0',
        '2023-0-01',
        '2023-01-32',
        '2023-13-31',
        '2023-13-32'
      ])('"%s" must be invalid', (value) => {
        expect(isDateString(value)).toBe(false)
      })
    })
  })
})
