import { IteratorResultLike } from './types'

export class IteratorResultInstance<Value> {
  public readonly done: boolean
  public readonly value: Value

  constructor(param: IteratorResultLike<Value>) {
    this.done = Boolean(param.done)
    this.value = param.done ? undefined as any : param.value
  }
}

export default IteratorResultInstance
