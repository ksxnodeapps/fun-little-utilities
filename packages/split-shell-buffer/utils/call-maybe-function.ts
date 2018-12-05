import { Func, MaybeFunc } from './types'

export =
  <Return, Args extends any[]>
    (fn: MaybeFunc<Return, Args>, ...args: Args): Return =>
      typeof fn === 'function' ? (fn as Func<Return, Args>)(...args) : fn
