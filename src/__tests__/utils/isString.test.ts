import isString from '../../utils/isString'

describe('isString()', () => {
  describe('✅ a string', () => {
    it.each(['', 'string'])('"%p" must be a string', (value) => {
      expect(isString(value)).toBe(true)
    })
  })

  describe('❌ not a string', () => {
    it.each([
      0,
      1,
      -1,
      1.1,
      -1.1,
      [],
      {},
      null,
      undefined,
      NaN,
      Infinity,
      -Infinity,
      new Date(),
      () => {}
    ])('"%p" must not be a string', (value) => {
      expect(isString(value)).toBe(false)
    })
  })
})
