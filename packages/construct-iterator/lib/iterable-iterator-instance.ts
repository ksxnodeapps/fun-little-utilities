import IteratorInstance from './iterator-instance'

export class IterableIteratorInstance<Element>
  extends IteratorInstance<Element>
  implements IterableIterator<Element> {}

export default IterableIteratorInstance
