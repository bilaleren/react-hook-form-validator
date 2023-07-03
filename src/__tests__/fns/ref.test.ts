import ref from '../../fns/ref'

describe('ref()', () => {
  it('should return field paths', () => {
    const anyRef = ref('field')
    const anyRef2 = ref(['field', 'field2'])

    expect(anyRef.getPaths()).toStrictEqual(['field'])
    expect(anyRef2.getPaths()).toStrictEqual(['field', 'field2'])
  })

  it('should resolve field values', () => {
    const formValues = {
      field: 'value',
      field2: 1,
      object: {
        value: true
      },
      array: [1]
    }
    const anyRef = ref<typeof formValues>('field')
    const anyRef2 = ref<typeof formValues>([
      'field',
      'field2',
      'object',
      'object.value',
      'array',
      'array.0',
      'array.1'
    ])

    expect(anyRef.resolveValues(formValues)).toStrictEqual([formValues.field])
    expect(anyRef2.resolveValues(formValues)).toStrictEqual([
      formValues.field,
      formValues.field2,
      formValues.object,
      formValues.object.value,
      formValues.array,
      formValues.array[0],
      formValues.array[1]
    ])
  })

  it('should default condition is "and"', () => {
    const anyRef = ref('field')

    expect(anyRef.getCondition()).toBe('and')
  })

  it('condition should be applied as "or"', () => {
    const anyRef = ref('field', 'or')

    expect(anyRef.getCondition()).toBe('or')
  })

  it('condition should be applied as "and"', () => {
    const anyRef = ref('field', 'and')

    expect(anyRef.getCondition()).toBe('and')
  })
})
