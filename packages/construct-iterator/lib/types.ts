import { MaybePromise } from '../utils/types'
import IteratorResultInstance from './iterator-result-instance'
import AsyncIteratorResultInstance from './async-iterator-result-instance'

export interface NextFuncLike<Value> {
  (): IteratorResultLike<Value>
}

export type IteratorResultLike<Value> =
  | IteratorResultLike.Undone<Value>
  | IteratorResultLike.Done

export namespace IteratorResultLike {
  export interface Undone<Value> {
    readonly done?: false
    readonly value: Value
  }

  export interface Done {
    readonly done: true
  }
}

export interface NextFunc<Value> {
  (): IteratorResultInstance<Value>
}

export interface AsyncNextFuncLike<Value> {
  (): AsyncIteratorResultLike<Value>
}

export interface AsyncNextFuncLike<Value> {
  (): AsyncIteratorResultLike<Value>
}

export type AsyncIteratorResultLike<Value> = MaybePromise<IteratorResultLike<Value>>

export interface AsyncNextFunc<Value> {
  (): AsyncIteratorResultInstance<Value>
}
