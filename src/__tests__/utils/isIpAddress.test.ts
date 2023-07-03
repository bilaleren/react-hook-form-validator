import isIpAddress from '../../utils/isIpAddress'

describe('isIpAddress()', () => {
  describe('✅ a valid IP address', () => {
    it.each([
      '0.0.0.0',
      '1.1.1.1',
      '0.200.68.100',
      '0.200.68.0',
      '178.16.244.49',
      '248.86.181.149',
      '125.155.74.111',
      '103.1.55.197',
      '202.214.205.160',
      '105.255.109.136'
    ])('"%s" must be a valid IP address', (value) => {
      expect(isIpAddress(value)).toBe(true)
    })
  })

  describe('❌ not a valid IP address', () => {
    it.each([
      0,
      1,
      -1,
      true,
      false,
      null,
      undefined,
      '',
      '01.0.0.0',
      '010.0.0.0',
      '.0.0.0',
      '0.0.0.',
      '0.0.0',
      '256.150.60.70',
      '256.150.60.25'
    ])('"%s" must be a invalid IP address', (value) => {
      expect(isIpAddress(value)).toBe(false)
    })
  })
})
