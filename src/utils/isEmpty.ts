import isDefined from './isDefined'
import isCountable from './isCountable'

function isEmpty(value: unknown): boolean {
  return !isDefined(value) || (isCountable(value) && value.length === 0)
}

export default isEmpty
