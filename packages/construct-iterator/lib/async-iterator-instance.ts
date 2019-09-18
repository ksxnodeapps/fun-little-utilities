import 'monorepo-shared-assets/.polyfill'
import { AsyncNextFuncLike, AsyncNextFunc } from './types'
import createAsyncNextFunc from './create-async-next-func'

export class AsyncIteratorInstance<Element> implements AsyncIterator<Element>, AsyncIterable<Element> {
  // @ts-ignore
  public readonly [Symbol.asyncIterator]: () => this
  // @ts-ignore
  public readonly next: AsyncNextFunc<Element>

  constructor (next: AsyncNextFuncLike<Element>) {
    this[Symbol.asyncIterator] = () => this
    this.next = createAsyncNextFunc(next)
  }
}

export default AsyncIteratorInstance
