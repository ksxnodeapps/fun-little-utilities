import { AsyncNextFuncLike } from './types'
import AsyncIterableIteratorInstance from './async-iterable-iterator-instance'
export default <Element>(next: AsyncNextFuncLike<Element>) => new AsyncIterableIteratorInstance<Element>(next)
