import isEmail from '../../utils/isEmail'

describe('isEmail()', () => {
  describe('✅ a valid email', () => {
    it.each([
      'email@example.com',
      'firstname.lastname@example.com',
      'email@subdomain.example.com',
      'firstname+lastname@example.com',
      'email@123.123.123.123',
      '1234567890@example.com',
      'email@example-one.com',
      '_______@example.com',
      'email@example.name',
      'email@example.museum',
      'email@example.co.jp',
      'firstname-lastname@example.com'
    ])('"%s" must be a valid e-mail address', (value) => {
      expect(isEmail(value)).toBe(true)
    })
  })

  describe('❌ not a valid email', () => {
    it.each([
      0,
      1,
      -1,
      true,
      false,
      [1],
      '',
      'plainaddress',
      '#@%^%#$@#$@#.com',
      '@example.com',
      'Joe Smith <email@example.com>',
      'email.example.com',
      'email@example@example.com',
      'あいうえお@example.com',
      'email@example.com (Joe Smith)',
      'email@-example.com',
      'email@example..com',
      '”(),:;<>[]@example.com',
      'just”not”right@example.com',
      'this is"really"notallowed@example.com',
      'much.”more unusual”@example.com',
      'very.unusual.”@”.unusual.com@example.com',
      'very.”(),:;<>[]”.VERY.”very@\\ "very”.unusual@strange.example.com'
    ])('"%s" must be a invalid e-mail address', (value) => {
      expect(isEmail(value)).toBe(false)
    })
  })
})
