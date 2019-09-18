import { EventedStream } from 'evented-stream-types'

export class ChunkCarrier<
  Stream extends EventedStream<Chunk, Error>,
  Chunk = any,
  Error = any
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

export default ChunkCarrier
