import { IteratorResultLike } from './types'
const result: IteratorResult<any> & IteratorResultLike.Done = { done: true, value: undefined }
export default Object.freeze(result)
