import * as types from './types'
import { StdOutError, StdErrError } from './error-classes'
import SplitterObject from './splitter-object'
import fromEventedStream from './from-evented-stream'

function fromChildProcess (cp: types.ChildProcess): SplitterObject {
  const { stdout, stderr } = cp

  const stream: types.EventedStream = {
    addListener (event: any, fn: any): void {
      switch (event) {
        case 'close':
          cp.addListener('close', fn)
          break

        case 'error':
          cp.addListener('error', fn)
          stdout.addListener('error', error => fn(new StdOutError(stdout, error)))
          stderr.addListener('error', error => fn(new StdErrError(stderr, error)))
          break

        case 'data':
          stdout.addListener('data', fn)
          stderr.addListener('data', fn)
          break
      }
    }
  }

  return fromEventedStream(stream)
}

export = fromChildProcess
