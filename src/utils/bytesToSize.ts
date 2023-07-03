const KILOBYTE_UNIT = 1000
const SIZES = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB']

function bytesToSize(bytes: number, kilobyteUnit?: number): string {
  kilobyteUnit ||= KILOBYTE_UNIT

  if (bytes === 0) {
    return 'n/a'
  }

  const sizeIndex = Math.floor(
    Math.log(Math.abs(bytes)) / Math.log(kilobyteUnit)
  )

  if (sizeIndex === 0) {
    return `${bytes} ${SIZES[sizeIndex]}`
  }

  const bytesText = (bytes / kilobyteUnit ** sizeIndex)
    .toFixed(1)
    .replace(/\.0$/, '')

  return `${bytesText} ${SIZES[sizeIndex]}`
}

export default bytesToSize
