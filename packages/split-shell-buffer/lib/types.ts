import { EventedStream } from 'evented-stream-types'
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

export interface ChildProcess<Chunk, Err = Error> {
  readonly stdout: EventedStream<Chunk, Err>
  readonly stderr: EventedStream<Chunk, Err>
  readonly addListener: ChildProcess.ListenerModifier
  readonly removeListener: ChildProcess.ListenerModifier
}

export namespace ChildProcess {
  export interface ListenerModifier {
    (event: 'close', listener: CloseEventListener): void
    (event: 'error', listener: ErrorEventListener): void
  }

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
