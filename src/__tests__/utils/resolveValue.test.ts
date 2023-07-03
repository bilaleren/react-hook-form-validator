import resolveValue from '../../utils/resolveValue'

describe('resolveValue()', () => {
  it('should return 1', () => {
    expect(resolveValue(1)).toBe(1)
  })

  it('should run the function with parameters', () => {
    expect(resolveValue((a: number, b: number) => a + b, 1, 2)).toBe(3)
  })
})
