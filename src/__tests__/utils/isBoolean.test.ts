import isBoolean from '../../utils/isBoolean'

describe('isBoolean()', () => {
  describe('✅ a boolean', () => {
    it.each([true, false])('"%p" must be a boolean', (value) => {
      expect(isBoolean(value)).toBe(true)
    })
  })

  describe('❌ not a boolean', () => {
    it.each([
      [],
      1,
      0,
      -1,
      1.1,
      -1.1,
      '',
      {},
      () => {},
      null,
      undefined,
      /1/,
      new Date()
    ])('"%p" must be not a boolean', (value) => {
      expect(isBoolean(value)).toBe(false)
    })
  })
})
