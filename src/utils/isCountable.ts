import isArray from './isArray'
import isString from './isString'
import isFileList from './isFileList'

function isCountable(value: unknown): value is string | Array<any> | FileList {
  return isString(value) || isArray(value) || isFileList(value)
}

export default isCountable
