import { IteratorResultLike } from './types'
import IteratorResultInstance from './iterator-result-instance'
export = <Value> (param: IteratorResultLike<Value>) => new IteratorResultInstance<Value>(param)
