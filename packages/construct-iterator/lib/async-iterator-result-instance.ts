import { MaybePromise } from '../utils/types'
import { AsyncIteratorResultLike } from './types'
import createIteratorResult from './create-iterator-result'
import IteratorResultInstance from './iterator-result-instance'

class AsyncIteratorResultInstance<Value> extends Promise<IteratorResultInstance<Value>> {
  constructor (param: AsyncIteratorResultInstance.ConstructorParam<Value>) {
    super(
      typeof param === 'function'
        ? param // Must be able to take a function
        : async resolve => resolve(createIteratorResult(await param))
    )
  }

  public then<Return> (
    onresolve: (value: IteratorResultInstance<Value>) => Return,
    onreject: (error: any) => any
  ) {
    return super.then(onresolve, onreject)
  }
}

namespace AsyncIteratorResultInstance {
  export type ConstructorParam<Value> =
    AsyncIteratorResultLike<Value> |
    Callback<Value>

  export interface Callback<Value> {
    (resolve: Resolver<Value>, reject: Rejector): void
  }

  export interface Resolver<Value> {
    (value: MaybePromise<IteratorResultInstance<Value>>): void
  }

  export interface Rejector {
    (reason: any): void
  }
}

export = AsyncIteratorResultInstance
