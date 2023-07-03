import isPlainObject from '../../utils/isPlainObject'

describe('isPlainObject()', () => {
  describe('✅ a plain object', () => {
    it.each([{}, { key: 1 }])('"%p" must be a plain object', (value) => {
      expect(isPlainObject(value)).toBe(true)
    })
  })

  describe('❌ not a plain object', () => {
    it.each([
      0,
      1,
      -1,
      1.1,
      -1.1,
      [],
      null,
      undefined,
      NaN,
      Infinity,
      -Infinity,
      new Date(),
      () => {}
    ])('"%p" must not be a plain object', (value) => {
      expect(isPlainObject(value)).toBe(false)
    })
  })
})
