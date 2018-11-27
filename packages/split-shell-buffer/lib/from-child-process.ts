import * as types from './types'
import { StdOutError, StdErrError } from './error-classes'
import SplitterObject from './splitter-object'
import fromEventedStream from './from-evented-stream'

function fromChildProcess<Chunk extends string | Buffer> (cp: types.ChildProcess<Chunk>): SplitterObject {
  const { stdout, stderr } = cp

  const stream: types.EventedStream<Chunk, any> = {
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
    },

    removeListener (event: any, fn: any): void {
      switch (event) {
        case 'close':
          cp.removeListener('close', fn)
          break

        case 'error':
          cp.removeListener('error', fn)
          stdout.removeListener('error', error => fn(new StdOutError(stdout, error)))
          stderr.removeListener('error', error => fn(new StdErrError(stderr, error)))
          break

        case 'data':
          stdout.removeListener('data', fn)
          stderr.removeListener('data', fn)
          break
      }
    }
  }

  return fromEventedStream(stream)
}

export = fromChildProcess
