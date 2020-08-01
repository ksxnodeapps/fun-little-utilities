import { IteratorResultLike } from './types'
export default <Value>(value: Value): IteratorResult<Value> & IteratorResultLike.Undone<Value> => ({
  done: false,
  value,
})
