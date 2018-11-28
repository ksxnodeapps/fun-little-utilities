import { EventedStream } from 'evented-stream-types'
import EventedStreamCombination from './lib/evented-stream-combination'
import ChunkCarrier from './lib/chunk-carrier'
import ErrorCarrier from './lib/error-carrier'

function combineEventedStream<StreamChunk, StreamError = any> (
  source: Iterable<EventedStream<StreamChunk, StreamError>>
): EventedStreamCombination<StreamChunk, StreamError> {
  type Stream = EventedStream<StreamChunk, StreamError>
  type Chunk = ChunkCarrier<Stream>
  type Error = ErrorCarrier<Stream>
  type EvtMod = EventedStream.ListenerModifier<Chunk, Error>
  type Event = 'close' | 'error' | 'data'
  type EvtModFn = (stream: Stream, event: Event, fn: any) => void

  const collection = Array.from(source)

  const createEvtMod = (modfn: EvtModFn): EvtMod => (event: Event, fn: any) => {
    switch (event) {
      case 'close':
        Promise.all(collection.map(
          stream => new Promise<void>(resolve => {
            stream.addListener('close', () => resolve())
          })
        )).then(
          () => (fn as EventedStream.CloseEventListener)()
        )
        break

      case 'data':
        collection.forEach(
          stream => modfn(
            stream,
            event,
            (chunk: StreamChunk) => (
              fn as EventedStream.DataEventListener<Chunk>
            )(new ChunkCarrier(chunk, stream))
          )
        )
        break

      case 'error':
        collection.forEach(
          stream => modfn(
            stream,
            event,
            (error: StreamError) => (
              fn as EventedStream.ErrorEventListener<Error>
            )(new ErrorCarrier<Stream>(error, stream))
          )
        )
        break
    }
  }

  class EvtStrCmb extends EventedStreamCombination<StreamChunk, StreamError> {
    public readonly addListener =
      createEvtMod((stream, event, fn) => stream.addListener(event as any, fn))

    public readonly removeListener =
      createEvtMod((stream, event, fn) => stream.removeListener(event as any, fn))
  }

  return new EvtStrCmb()
}

export = combineEventedStream
