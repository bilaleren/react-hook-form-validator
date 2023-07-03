import awaited from '../../utils/awaited'

describe('awaited()', () => {
  it('must be resolves value', () => {
    expect(awaited(1)).resolves.toBe(1)
    expect(awaited(new Promise((resolve) => resolve(1)))).resolves.toBe(1)
  })
})
