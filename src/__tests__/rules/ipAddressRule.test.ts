import { ipAddressRule } from '../../rules'
import { createMessage } from '../../utils'
import { getLocale } from '../../hookFormValidator'

const locale = getLocale()

describe('ipAddressRule()', () => {
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
      const validate = ipAddressRule(locale)
      expect(validate(value, {})).toBe(true)
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
      // default
      const validate1 = ipAddressRule(locale)
      // custom message
      const validate2 = ipAddressRule(locale, 'custom message')

      expect(validate1(value, {})).toBe(
        createMessage(locale.ipAddress, value, {})
      )
      expect(validate2(value, {})).toBe('custom message')
    })
  })
})
