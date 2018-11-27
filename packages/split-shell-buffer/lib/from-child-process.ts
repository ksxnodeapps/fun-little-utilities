import * as types from './types'
import { StdOutError, StdErrError } from './error-classes'
import SplitterObject from './splitter-object'
import fromEventedStream from './from-evented-stream'

function fromChildProcess (cp: types.ChildProcess): SplitterObject {
  const { stdout, stderr } = cp

  const stream: types.EventedStream = {
    on (event: any, fn: any) {
      if (event === 'close') {
        cp.on('close', fn)
      } else if (event === 'error') {
        cp.on('error', fn)
        stdout.on('error', error => fn(new StdOutError(stdout, error)))
        stderr.on('error', error => fn(new StdErrError(stderr, error)))
      } else {
        stdout.on(event, fn)
        stderr.on(event, fn)
      }
    }
  }

  return fromEventedStream(stream)
}

export = fromChildProcess
