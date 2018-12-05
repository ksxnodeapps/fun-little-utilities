import { IteratorResultLike } from './types'
export = <Value> (value: Value): IteratorResult<Value> & IteratorResultLike.Undone<Value> => ({ done: false, value })
