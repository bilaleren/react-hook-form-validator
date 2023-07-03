import isEmpty from '../../utils/isEmpty'

describe('isEmpty()', () => {
  describe('✅ empty', () => {
    it.each([null, undefined, [], ''])('"%p" should be empty', (value) => {
      expect(isEmpty(value)).toBe(true)
    })
  })

  describe('❌ not empty', () => {
    it.each([0, 1, -1, 1.1, -1.1, '1', [1], {}, new Date(), () => {}])(
      '"%p" should not be empty',
      (value) => {
        expect(isEmpty(value)).toBe(false)
      }
    )
  })
})
