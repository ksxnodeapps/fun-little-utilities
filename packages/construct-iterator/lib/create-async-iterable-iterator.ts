import { AsyncNextFuncLike } from './types'
import AsyncIterableIteratorInstance from './async-iterable-iterator-instance'
export = <Element> (next: AsyncNextFuncLike<Element>) => new AsyncIterableIteratorInstance<Element>(next)
