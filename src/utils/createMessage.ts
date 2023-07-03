import format from './format'
import resolveValue from './resolveValue'
import type { Message, FieldValue, MessageArguments } from '../types'

function createMessage(
  message: Message,
  fieldValue: FieldValue,
  args: MessageArguments
): string {
  const { constraints } = args

  return format(resolveValue(message, fieldValue, args), constraints)
}

export default createMessage
