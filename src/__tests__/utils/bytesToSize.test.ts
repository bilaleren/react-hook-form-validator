import bytesToSize from '../../utils/bytesToSize'

const oneMB = (kilobyteUnit: number) => kilobyteUnit ** 2
const oneGB = (kilobyteUnit: number) => oneMB(kilobyteUnit) * kilobyteUnit
const oneTB = (kilobyteUnit: number) => oneGB(kilobyteUnit) * kilobyteUnit
const onePB = (kilobyteUnit: number) => oneTB(kilobyteUnit) * kilobyteUnit

describe('bytesToSize()', () => {
  describe.each([1000, 1024])('kilobyte unit "%d"', (kilobyteUnit) => {
    it.each([
      [0, 'n/a'],
      // Byte
      [999, '999 Byte'],
      // KB
      [kilobyteUnit, '1 KB'],
      [kilobyteUnit * 2, '2 KB'],
      [kilobyteUnit * 2.2, '2.2 KB'],
      // MB
      [oneMB(kilobyteUnit), '1 MB'],
      [oneMB(kilobyteUnit) * 2, '2 MB'],
      [oneMB(kilobyteUnit) * 2.3, '2.3 MB'],
      // GB
      [oneGB(kilobyteUnit), '1 GB'],
      [oneGB(kilobyteUnit) * 2, '2 GB'],
      [oneGB(kilobyteUnit) * 5.3, '5.3 GB'],
      // TB
      [oneTB(kilobyteUnit), '1 TB'],
      [oneTB(kilobyteUnit) * 2, '2 TB'],
      [oneTB(kilobyteUnit) * 3.3, '3.3 TB'],
      // PB
      [onePB(kilobyteUnit), '1 PB'],
      [onePB(kilobyteUnit) * 2, '2 PB'],
      [onePB(kilobyteUnit) * 3.9, '3.9 PB']
    ])('"%s" bytes should appear as "%s"', (bytes, expectedSize) => {
      // kilobyte unit default is 1000
      expect(bytesToSize(bytes, kilobyteUnit)).toBe(expectedSize)
    })
  })
})
