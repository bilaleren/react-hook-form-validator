import addDays from '../../utils/test/addDays'
import compareValues from '../../utils/compareValues'

describe('compareValues()', () => {
  describe('values must be equal to each other', () => {
    it.each([
      ['', ''],
      ['1', '1'],
      [1, 1],
      [-1, -1],
      [1.1, 1.1],
      [-1.1, -1.1],
      [true, true],
      [false, false],
      [null, null],
      [undefined, undefined],
      [{}, {}],
      [{ key: 1 }, { key: 1 }],
      [[1], [1]],
      [/1/, /1/],
      [new Date(), new Date()],
      ['2023-01-01', '2023-01-01'], // date string
      ['2023-01-01T23:00', '2023-01-01T23:00'] // date string
    ])('"%p" must be equal to "%p"', (a, b) => {
      expect(compareValues(a, b)).toBe(true)
      expect(compareValues(a, b, '==')).toBe(true)
    })
  })

  describe('values must be not equal to each other', () => {
    it.each([
      [1, 0],
      [-1, 0],
      [-1, -2],
      [1.2, 1.1],
      [-1.2, -1.1],
      [1, '1'],
      ['1', '0'],
      [{}, { key: 1 }],
      [true, false],
      [null, undefined],
      [[1], [2]],
      [/1/, /2/],
      ['2023-01-01', '2023-01-02'], // date string
      ['2023-01-01T23:00', '2023-01-01T22:00'], // date string
      [addDays(new Date(1), 1), new Date()]
    ])('"%p" must not be equal to "%p', (a, b) => {
      expect(compareValues(a, b, '!=')).toBe(true)
    })
  })

  describe('values must be greater than to each other', () => {
    it.each([
      [1, 0],
      [0, -1],
      [1.1, 0.1],
      [-1, -1.1],
      ['2023-02-01', '2023-01-01'],
      ['2023-01-01T00:01', '2023-01-01T00:00'],
      [addDays(new Date(), 1), new Date()]
    ])('"%p" must be greater than "%p"', (a, b) => {
      expect(compareValues(a, b, '>')).toBe(true)
    })
  })

  describe('values must be greater than or equal to each other', () => {
    it.each([
      [1, 0],
      [1, 1],
      [1.1, 1],
      [1.1, 1.1],
      [-1, -2],
      [-1, -1],
      [new Date(), new Date()],
      [addDays(new Date(), 1), new Date()],
      ['2023-02-01', '2023-01-01'],
      ['2023-01-01', '2023-01-01'],
      ['2023-01-01T00:01', '2023-01-01T00:00'],
      ['2023-01-01T00:00', '2023-01-01T00:00']
    ])('"%p" must be greater than or equal "%p"', (a, b) => {
      expect(compareValues(a, b, '>=')).toBe(true)
    })
  })

  describe('values must be less than to each other', () => {
    it.each([
      [0, 1],
      [-2, -1],
      [1.1, 1.2],
      [new Date(), addDays(new Date(), 1)],
      ['2023-01-01', '2023-02-01'],
      ['2023-01-01', '2023-01-02'],
      ['2023-01-01T01:00', '2023-01-01T02:00'],
      ['2023-01-01T00:59', '2023-01-01T01:00']
    ])('"%p" must be less than "%p"', (a, b) => {
      expect(compareValues(a, b, '<')).toBe(true)
    })
  })

  describe('values must be less than or equal to each other', () => {
    it.each([
      [0, 1],
      [-2, -1],
      [1.1, 1.2],
      [-2, -2],
      [1.1, 1.1],
      [new Date(), new Date()],
      [new Date(), addDays(new Date(), 1)],
      ['2023-01-01', '2023-01-01'],
      ['2023-01-01T00:00', '2023-01-01T00:00'],
      ['2023-01-01T00:01', '2023-01-01T00:59']
    ])('"%p" must be less than or equal "%p"', (a, b) => {
      expect(compareValues(a, b, '<=')).toBe(true)
    })
  })

  describe('should return false when the value is NaN, Infinity or -Infinity', () => {
    it.each([
      [NaN, NaN],
      [NaN, Infinity],
      [NaN, -Infinity],
      [Infinity, Infinity],
      [Infinity, -Infinity]
    ])('"%p" >, >=, <, <= "%p"', (a, b) => {
      expect(compareValues(a, b, '>')).toBe(false)
      expect(compareValues(a, b, '>=')).toBe(false)
      expect(compareValues(a, b, '<')).toBe(false)
      expect(compareValues(a, b, '<=')).toBe(false)
    })
  })
})
