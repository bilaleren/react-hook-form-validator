import isDate from '../../utils/isDate'

describe('isDate()', () => {
  describe('✅ a valid date', () => {
    it('value must be a Date', () => {
      expect(isDate(new Date())).toBe(true)
    })
  })

  describe('❌ not a valid date', () => {
    it.each([
      1,
      0,
      -1,
      1.1,
      -1.1,
      '',
      true,
      false,
      null,
      undefined,
      [],
      {},
      () => {}
    ])('"%p" must not be a Date', (value) => {
      expect(isDate(value)).toBe(false)
    })
  })
})
