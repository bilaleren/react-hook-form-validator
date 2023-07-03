import Ref from '../Ref'

function isRef(value: unknown): value is Ref {
  return value instanceof Ref
}

export default isRef
