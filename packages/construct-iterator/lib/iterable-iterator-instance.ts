import IteratorInstance from './iterator-instance'

class IterableIteratorInstance<Element>
  extends IteratorInstance<Element>
  implements IterableIterator<Element> {}

export = IterableIteratorInstance
