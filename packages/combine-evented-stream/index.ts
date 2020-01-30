import { EventEmitter } from 'events'
import { EventedStream } from 'evented-stream-types'
import proxify, { EventTarget } from 'event-target-proxy'
import EventedStreamCombination from './lib/evented-stream-combination'
import ChunkCarrier from './lib/chunk-carrier'
import ErrorCarrier from './lib/error-carrier'
export * from 'evented-stream-types'

export function combineEventedStream<
  Stream extends EventedStream<StreamChunk, StreamError>,
  StreamChunk = any,
  StreamError = any
> (
  source: Iterable<Stream>
): EventedStreamCombination<Stream, StreamChunk, StreamError> {
  type Chunk = ChunkCarrier<Stream, StreamChunk, StreamError>
  type Error = ErrorCarrier<Stream, StreamError, StreamChunk>
  type EvtMod = EventedStream.ListenerModifier<Chunk, Error>
  type Event = 'close' | 'error' | 'data'
  type EvtModFn = <Event> (target: EventTarget<Event>, event: Event, fn: any) => void

  const collection = Array.from(source)

  const proxies = collection.map(stream => proxify(
    stream as EventTarget<'data' | 'error'>,
    ({ event, listener }) => {
      switch (event) {
        case 'data':
          return (chunk: StreamChunk) =>
            listener(new ChunkCarrier<Stream, StreamChunk, StreamError>(chunk, stream))

        case 'error':
          return (error: StreamError) =>
            listener(new ErrorCarrier<Stream, StreamError, StreamChunk>(error, stream))
      }
    }
  ))

  // tslint:disable-next-line:no-floating-promises
  Promise.all(collection.map(
    target => new Promise<void>(resolve => target.addListener('close', function listener () {
      target.removeListener('close', listener)
      resolve()
    }))
  )).then(() => closeEventEmitter.emit('close'))

  const closeEventEmitter = new EventEmitter()

  const createEvtMod = (modfn: EvtModFn): EvtMod => (event: Event, fn: any) => {
    switch (event) {
      case 'close':
        modfn(closeEventEmitter, 'close', fn)
        break

      case 'data':
      case 'error':
        proxies.map(proxy => modfn(proxy, event, fn))
        break
    }
  }

  class EvtStrCmb extends EventedStreamCombination<Stream, StreamChunk, StreamError> {
    public readonly addListener =
      createEvtMod((target, event, fn) => target.addListener(event, fn))

    public readonly removeListener =
      createEvtMod((target, event, fn) => target.removeListener(event, fn))
  }

  return new EvtStrCmb()
}

export default combineEventedStream
