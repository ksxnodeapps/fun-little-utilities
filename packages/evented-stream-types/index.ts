export interface EventedStream<Chunk, Err = any> {
  readonly addListener: EventedStream.ListenerModifier<Chunk, Err>
  readonly removeListener: EventedStream.ListenerModifier<Chunk, Err>
}

export namespace EventedStream {
  export interface ListenerModifier<Chunk, Err = any> {
    (event: 'data', listener: DataEventListener<Chunk>): void
    (event: 'error', listener: ErrorEventListener<Err>): void
    (event: 'close', listener: CloseEventListener): void
  }

  export type DataEventListener<Chunk> = (chunk: Chunk) => void
  export type ErrorEventListener<Err = any> = (error: Err) => void
  export type CloseEventListener = () => void
}
