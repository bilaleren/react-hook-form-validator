import isNumber from '../../utils/isNumber'

describe('isNumber()', () => {
  describe('✅ a number', () => {
    it.each([0, 1, -1, 1.1, -1.1])('"%p" must be a number', (value) => {
      expect(isNumber(value)).toBe(true)
    })
  })

  describe('❌ not a number', () => {
    it.each([
      '',
      new Date(),
      [],
      {},
      () => {},
      null,
      undefined,
      true,
      false,
      NaN,
      Infinity,
      -Infinity
    ])('"%p" must not be a number', (value) => {
      expect(isNumber(value)).toBe(false)
    })
  })
})
