import { EventedStream } from 'evented-stream-types'
import ChunkCarrier from './chunk-carrier'
import ErrorCarrier from './error-carrier'

export abstract class EventedStreamCombination<
  Stream extends EventedStream<StreamChunk, StreamError>,
  StreamChunk,
  StreamError,
  Chunk extends ChunkCarrier<Stream, StreamChunk, StreamError> =
    ChunkCarrier<Stream, StreamChunk, StreamError>,
  Error extends ErrorCarrier<Stream, StreamError, StreamChunk> =
    ErrorCarrier<Stream, StreamError, StreamChunk>
> implements EventedStream<Chunk, Error> {
  public abstract readonly addListener: EventedStream<Chunk, Error>['addListener']
  public abstract readonly removeListener: EventedStream<Chunk, Error>['removeListener']
}

export default EventedStreamCombination
