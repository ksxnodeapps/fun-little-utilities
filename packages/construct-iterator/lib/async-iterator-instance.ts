import 'monorepo-shared-assets/.polyfill'
import { AsyncNextFuncLike, AsyncNextFunc } from './types'
import createAsyncNextFunc from './create-async-next-func'

export class AsyncIteratorInstance<Element> {
  public readonly [Symbol.asyncIterator]: () => this
  public readonly next: AsyncNextFunc<Element>

  constructor(next: AsyncNextFuncLike<Element>) {
    this[Symbol.asyncIterator] = () => this
    this.next = createAsyncNextFunc(next)
  }
}

export default AsyncIteratorInstance
