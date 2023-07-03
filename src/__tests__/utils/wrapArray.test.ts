import wrapArray from '../../utils/wrapArray'

describe('wrapArray()', () => {
  it('should convert non-array values to array', () => {
    expect(wrapArray('1')).toStrictEqual(['1'])
    expect(wrapArray(1)).toStrictEqual([1])
    expect(wrapArray(true)).toStrictEqual([true])
    expect(wrapArray(false)).toStrictEqual([false])
    expect(wrapArray(null)).toStrictEqual([null])
    expect(wrapArray(undefined)).toStrictEqual([undefined])
  })

  it('should return values that are arrays in the same way', () => {
    expect(wrapArray(['1'])).toStrictEqual(['1'])
    expect(wrapArray([1])).toStrictEqual([1])
    expect(wrapArray([1, [1]])).toStrictEqual([1, [1]])
    expect(wrapArray([true])).toStrictEqual([true])
    expect(wrapArray([false])).toStrictEqual([false])
    expect(wrapArray([null])).toStrictEqual([null])
    expect(wrapArray([undefined])).toStrictEqual([undefined])
  })
})
