import patternToRegexp from '../../utils/patternToRegexp'

describe('patternToRegexp()', () => {
  // # [0-9] and * [a-zA-Z0-9]
  it.each([
    ['', ''],
    ['05## ### ####', '0555 222 5555'],
    ['+90 216 ### ## ##', '+90 216 222 55 55'],
    ['+1 (###) ###‑####', '+1 (415) 555‑0132'],
    ['###,##', '500,10'],
    ['###', '546'],
    ['##/##', '01/27'],
    ['###.###,##', '500.150,00'],
    ['####-##-##', '2023-01-01'],
    ['####/##/##', '2023/01/01'],
    ['####.##.##', '2023.01.01']
  ])('"%s" pattern must match "%s" value', (pattern, value) => {
    expect(patternToRegexp(pattern).test(value)).toBe(true)
  })
})
