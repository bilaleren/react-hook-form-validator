import isEmptyObject from '../../utils/isEmptyObject'

describe('isEmptyObject()', () => {
  describe('✅ empty', () => {
    it.each([{}, null, undefined])('"%p" must be a empty object', (value) => {
      expect(isEmptyObject(value)).toBe(true)
    })
  })

  describe('❌ not empty', () => {
    it.each([{ key: 1 }, { key: [] }])(
      '"%p" must not be a empty object',
      (value) => {
        expect(isEmptyObject(value)).toBe(false)
      }
    )
  })
})
