import { EventedStream } from 'evented-stream-types'

class ChunkCarrier<
  Stream extends EventedStream<Chunk, Error>,
  Chunk = Stream extends EventedStream<infer X, any> ? X : any,
  Error = Stream extends EventedStream<any, infer X> ? X : any
> {
  public readonly stream: Stream
  public readonly chunk: Chunk

  constructor (chunk: Chunk, stream: Stream) {
    this.stream = stream
    this.chunk = chunk
  }

  public valueOf (): Chunk {
    return this.chunk
  }
}

export = ChunkCarrier
