import 'monorepo-shared-assets/.polyfill'
import { AsyncNextFuncLike, AsyncNextFunc } from './types'
import createAsyncNextFunc from './create-async-next-func'

class AsyncIteratorInstance<Element> implements AsyncIterator<Element>, AsyncIterable<Element> {
  public readonly [Symbol.asyncIterator]: () => this
  public readonly next: AsyncNextFunc<Element>

  constructor (next: AsyncNextFuncLike<Element>) {
    this[Symbol.asyncIterator] = () => this
    this.next = createAsyncNextFunc(next)
  }
}

export = AsyncIteratorInstance
