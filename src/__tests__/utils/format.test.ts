import format from '../../utils/format'

describe('format()', () => {
  it.each([
    { tmpl: 'Text {value}', values: undefined, expected: 'Text {value}' },
    {
      tmpl: 'Text {value}',
      values: { value: new Date() },
      expected: `Text ${new Date()}`
    },
    {
      tmpl: 'Text {value}',
      values: { value: { x: 1 } },
      expected: 'Text {value}'
    },
    { tmpl: 'Text {value}', values: { value: 1 }, expected: 'Text 1' },
    { tmpl: 'Text {value}', values: { value: '1' }, expected: 'Text 1' },
    {
      tmpl: 'Text {value}',
      values: { value: null },
      expected: 'Text {value}'
    },
    {
      tmpl: 'Text {value}',
      values: { value: undefined },
      expected: 'Text {value}'
    },
    { tmpl: 'Text {value}', values: { value: /1/ }, expected: 'Text /1/' },
    {
      tmpl: 'Text {value}',
      values: { value: { key: 1, key2: 2 } },
      expected: 'Text {value}'
    },
    {
      tmpl: 'Text {value}',
      values: { value: [1, 2, 3] },
      expected: 'Text 1,2,3'
    },
    {
      tmpl: 'Text {value} {value2}',
      values: undefined,
      expected: 'Text {value} {value2}'
    },
    {
      tmpl: 'Text {value} {value2}',
      values: { value: 1, value2: 2 },
      expected: 'Text 1 2'
    },
    {
      tmpl: 'Text {value} {value2}',
      values: { value: '1', value2: true },
      expected: 'Text 1 true'
    },
    {
      tmpl: 'Text {value} {value2}',
      values: { value: null, value2: 'test' },
      expected: 'Text {value} test'
    },
    {
      tmpl: 'Text {value} {value2}',
      values: { value: undefined, value2: null },
      expected: 'Text {value} {value2}'
    },
    {
      tmpl: 'Text {value} {value2}',
      values: { value: /1/, value2: /3/ },
      expected: 'Text /1/ /3/'
    },
    {
      tmpl: 'Text {value} {value2}',
      values: { value: { key: 1, key2: 2 }, value2: [1, 2] },
      expected: 'Text {value} 1,2'
    },
    {
      tmpl: 'Text {value} {value2}',
      values: { value: [1, 2, 3], value2: { key: 1, key2: 2, key3: 3 } },
      expected: 'Text 1,2,3 {value2}'
    }
  ])(
    '"$tmpl" should be replaced with "$expected"',
    ({ tmpl, values, expected }) => {
      expect(format(tmpl, values)).toBe(expected)
    }
  )
})
