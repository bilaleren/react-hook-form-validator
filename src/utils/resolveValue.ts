export type ValueFunction<TValue, TArgs extends unknown[]> = (
  ...args: TArgs
) => TValue

export type ValueOrFunction<TValue, TArgs extends unknown[]> =
  | TValue
  | ValueFunction<TValue, TArgs>

function resolveValue<TValue, TArgs extends unknown[]>(
  value: ValueOrFunction<TValue, TArgs>,
  ...args: TArgs
): TValue {
  return typeof value === 'function'
    ? (value as ValueFunction<TValue, TArgs>)(...args)
    : value
}

export default resolveValue
