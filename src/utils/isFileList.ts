import isDefined from './isDefined'

function isFileList(value: unknown): value is FileList {
  return (
    isDefined(value) &&
    Object.prototype.toString.call(value) === '[object FileList]'
  )
}

export default isFileList
