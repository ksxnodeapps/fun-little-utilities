import { EventedStream } from 'iterate-evented-stream'
import StringWritable from '../utils/string-writable'
import { ArrayLike, MaybeFunc } from '../utils/types'

export { EventedStream }

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

export interface ChildProcess<Chunk, Err = any> {
  readonly stdout: EventedStream<Chunk, Err>
  readonly stderr: EventedStream<Chunk, Err>
  addListener (event: 'close', listener: ChildProcess.CloseEventListener): void
  addListener (event: 'error', listener: ChildProcess.ErrorEventListener): void
  removeListener (event: 'close', listener: ChildProcess.CloseEventListener): void
  removeListener (event: 'error', listener: ChildProcess.ErrorEventListener): void
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
