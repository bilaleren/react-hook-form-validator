import isArray from '../../utils/isArray'

describe('isArray()', () => {
  describe('✅ a array', () => {
    it('"[]" must be a array', () => {
      expect(isArray([])).toBe(true)
    })

    it('"[1]" must be a array', () => {
      expect(isArray([1])).toBe(true)
    })
  })

  describe('❌ not a array', () => {
    it.each([
      '',
      '1',
      1,
      0,
      -1,
      1.1,
      -1.1,
      {},
      null,
      undefined,
      true,
      false,
      new Date(),
      () => {}
    ])('"%p" must not be a array', (value) => {
      expect(isArray(value)).toBe(false)
    })
  })
})
