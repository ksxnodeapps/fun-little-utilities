import AsyncIteratorInstance from './async-iterator-instance'

class AsyncIterableIteratorInstance<Element>
  extends AsyncIteratorInstance<Element>
  implements AsyncIterableIterator<Element> {}

export = AsyncIterableIteratorInstance
