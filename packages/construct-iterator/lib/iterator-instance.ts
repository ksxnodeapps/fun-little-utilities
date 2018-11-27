import { NextFuncLike, NextFunc } from './types'
import createNextFunc from './create-next-func'

class IteratorInstance<Element> implements Iterator<Element>, Iterable<Element> {
  public readonly [Symbol.iterator]: () => this
  public readonly next: NextFunc<Element>

  constructor (next: NextFuncLike<Element>) {
    this[Symbol.iterator] = () => this
    this.next = createNextFunc(next)
  }
}

export = IteratorInstance
