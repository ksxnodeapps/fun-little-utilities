export { Observable, OperatorFunction, MonoTypeOperatorFunction } from 'rxjs'

export type Stream =
  EventTarget<'data', Chunk> &
  EventTarget<'close', void>

export interface EventTarget<Type, Info> {
  addListener (type: Type, listener: Listener<Info>): void
  removeListener (type: Type, listener: Listener<Info>): void
}

export interface Listener<Info> {
  (info: Info): void
}

export interface Chunk {
  toString (): string
}
