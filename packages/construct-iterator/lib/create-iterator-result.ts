import { IteratorResultLike } from './types'
import IteratorResultInstance from './iterator-result-instance'
export default <Value>(param: IteratorResultLike<Value>) => new IteratorResultInstance<Value>(param)
