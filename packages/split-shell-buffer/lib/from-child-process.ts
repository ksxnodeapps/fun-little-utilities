import proxify, { EventTarget } from 'event-target-proxy'
import * as types from './types'
import { StdOutError, StdErrError } from './error-classes'
import SplitterObject from './splitter-object'
import fromEventedStream from './from-evented-stream'

function fromChildProcess<Chunk extends string | Buffer> (cp: types.ChildProcess<Chunk>): SplitterObject {
  const { stdout, stderr } = cp

  const proxifiedStdOut = proxify<'error' | 'data'>(
    stdout as EventTarget<'error' | 'data'>,
    ({ event, listener }) => event === 'error'
      ? ((error: Error) => listener(new StdOutError(stdout, error)))
      : listener
  )

  const proxifiedStdErr = proxify<'error' | 'data'>(
    stderr as EventTarget<'error' | 'data'>,
    ({ event, listener }) => event === 'error'
      ? ((error: Error) => listener(new StdErrError(stderr, error)))
      : listener
  )

  const createEvtMod = (
    modfn: <Event> (
      target: EventTarget<Event>,
      event: Event,
      fn: any
    ) => void
  ) => (event: 'close' | 'error' | 'data', fn: any) => {
    switch (event) {
      case 'close':
        modfn<'close'>(cp, 'close', fn)
        break

      case 'error':
        modfn<'error'>(cp, 'error', fn)
        modfn(proxifiedStdOut, 'error', fn)
        modfn(proxifiedStdErr, 'error', fn)
        break

      case 'data':
        modfn<'data'>(proxifiedStdOut, 'data', fn)
        modfn<'data'>(proxifiedStdErr, 'data', fn)
        break
    }
  }

  const addListener = createEvtMod((target, event, fn) => target.addListener(event, fn))
  const removeListener = createEvtMod((target, event, fn) => target.removeListener(event, fn))
  return fromEventedStream({ addListener, removeListener })
}

export = fromChildProcess
