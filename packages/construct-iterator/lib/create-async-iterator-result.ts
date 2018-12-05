import { AsyncIteratorResultLike } from './types'
import AsyncIteratorResultInstance from './async-iterator-result-instance'
export = <Value> (param: AsyncIteratorResultLike<Value>) => new AsyncIteratorResultInstance<Value>(param)
