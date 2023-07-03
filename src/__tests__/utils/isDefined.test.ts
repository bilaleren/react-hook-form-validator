import isDefined from '../../utils/isDefined'

describe('isDefined()', () => {
  describe('✅ defined', () => {
    it.each([
      0,
      1,
      -1,
      1.1,
      -1.1,
      '',
      true,
      false,
      [],
      [1],
      {},
      { key: 1 },
      new Date(),
      () => {}
    ])('should return true when "%p"', (value) => {
      expect(isDefined(value)).toBe(true)
    })
  })

  describe('❌ not defined', () => {
    it.each([null, undefined])('should return false when "%p"', (value) => {
      expect(isDefined(value)).toBe(false)
    })
  })
})
