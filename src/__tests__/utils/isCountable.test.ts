import isCountable from '../../utils/isCountable'

describe('isCountable()', () => {
  describe('✅ countable', () => {
    it.each([[], ''])('"%p" must be countable', (value) => {
      expect(isCountable(value)).toBe(true)
    })
  })

  describe('❌ uncountable', () => {
    it.each([
      1,
      0,
      -1,
      1.1,
      -1.1,
      null,
      true,
      false,
      undefined,
      {},
      new Date(),
      () => {}
    ])('"%p" must not be uncountable', (value) => {
      expect(isCountable(value)).toBe(false)
    })
  })
})
