import { AsyncNextFuncLike, AsyncNextFunc } from './types'
import createAsyncIteratorResult from './create-async-iterator-result'
export default <Value>(fn: AsyncNextFuncLike<Value>): AsyncNextFunc<Value> =>
  async () => createAsyncIteratorResult(await fn())
