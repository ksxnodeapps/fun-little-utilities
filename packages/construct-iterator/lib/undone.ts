import { IteratorResultLike } from './types'
export = <Value> (value: Value): IteratorResultLike.Undone<Value> => ({ done: false, value })
