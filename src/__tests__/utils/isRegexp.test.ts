import isRegexp from '../../utils/isRegexp'

describe('isRegexp()', () => {
  describe('✅ a regexp', () => {
    it.each([/1/, new RegExp('1')])('"%p" must be a regexp', (value) => {
      expect(isRegexp(value)).toBe(true)
    })
  })

  describe('❌ not a regexp', () => {
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
    ])('"%p" must not be a regexp', (value) => {
      expect(isRegexp(value)).toBe(false)
    })
  })
})
