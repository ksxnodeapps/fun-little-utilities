import StringWritable from '../utils/string-writable'
import { ArrayLike, MaybeFunc } from '../utils/types'

export type Code = number
export type Sequence = ArrayLike<Code>
export type Data = AsyncIterable<Code> | Iterable<Code>
export type IterableStream = AsyncIterable<Buffer | string>

export type SequenceFunc = MaybeFunc<Sequence, [SequenceFunc.Param]>

export namespace SequenceFunc {
  export interface Param {
    readonly splitter: Splitter
    readonly currentLine: Sequence
    readonly leadingCharacters: ReadonlyArray<Sequence>
  }
}

export interface Splitter {
  readonly data: Data
  readonly prefix: SequenceFunc
  readonly suffix: SequenceFunc
}

export interface Element {
  readonly format: ReadonlyArray<Sequence>
  readonly reset: Sequence
  readonly main: Sequence
  readonly prefix: Sequence
  readonly suffix: Sequence
}

export interface Writable {
  write (buffer: Buffer): void
}

export interface EventedStream {
  addListener (event: 'data', listener: EventedStream.DataEventListener): void
  addListener (event: 'error', listener: EventedStream.ErrorEventListener): void
  addListener (event: 'close', listener: EventedStream.CloseEventListener): void
}

export namespace EventedStream {
  export type DataEventListener = (data: Buffer) => void
  export type ErrorEventListener = (error: any) => void
  export type CloseEventListener = () => void
}

export interface ChildProcess {
  readonly stdout: EventedStream
  readonly stderr: EventedStream
  addListener (event: 'close', listener: ChildProcess.CloseEventListener): void
  addListener (event: 'error', listener: ChildProcess.ErrorEventListener): void
}

export namespace ChildProcess {
  export type CloseEventListener = () => void
  export type ErrorEventListener = () => void
}

export interface ConstructorOptions {
  readonly data: Data
  readonly prefix?: SequenceFunc
  readonly suffix?: SequenceFunc
}

export interface ToStringOptions extends StringWritable.ConstructorOptions {
  readonly finalNewLine?: boolean
}
