import AsyncIteratorInstance from './async-iterator-instance'

// @ts-ignore
export class AsyncIterableIteratorInstance<Element>
  extends AsyncIteratorInstance<Element>
  implements AsyncIterableIterator<Element> {}

export default AsyncIterableIteratorInstance
