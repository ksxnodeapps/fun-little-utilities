import { NextFuncLike } from './types'
import IterableIteratorInstance from './iterable-iterator-instance'
export default <Element> (next: NextFuncLike<Element>) => new IterableIteratorInstance<Element>(next)
