import AsyncIteratorInstance from './async-iterator-instance'

// @ts-ignore
class AsyncIterableIteratorInstance<Element>
  extends AsyncIteratorInstance<Element>
  implements AsyncIterableIterator<Element> {}

export = AsyncIterableIteratorInstance
