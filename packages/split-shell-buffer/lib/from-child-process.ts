import * as types from './types'
import { StdOutError, StdErrError } from './error-classes'
import SplitterObject from './splitter-object'
import fromEventedStream from './from-evented-stream'

function fromChildProcess (cp: types.ChildProcess): SplitterObject {
  const { stdout, stderr } = cp

  const stream: types.EventedStream = {
    on (event: any, fn: any): void {
      switch (event) {
        case 'close':
          cp.on('close', fn)
          break

        case 'error':
          cp.on('error', fn)
          stdout.on('error', error => fn(new StdOutError(stdout, error)))
          stderr.on('error', error => fn(new StdErrError(stderr, error)))
          break

        case 'data':
          stdout.on('data', fn)
          stderr.on('data', fn)
          break
      }
    }
  }

  return fromEventedStream(stream)
}

export = fromChildProcess
