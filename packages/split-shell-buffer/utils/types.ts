export type Func<Return, Args extends any[]> = (...args: Args) => Return

export type MaybeFunc<Return, Args extends any[]> =
  | Return
  | Func<Return, Args>

export interface ArrayLike<X> extends Iterable<X> {
  readonly length: number
}
