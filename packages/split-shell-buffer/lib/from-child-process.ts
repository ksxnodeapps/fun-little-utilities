import * as types from './types'
import SplitterObject from './splitter-object'
import fromEventedStream from './from-evented-stream'

function fromChildProcess (cp: types.ChildProcess): SplitterObject {
  const { stdout, stderr } = cp

  const stream: types.EventedStream = {
    on (event: any, fn: any) {
      if (event === 'close') {
        cp.on('close', fn)
      } else {
        stdout.on(event, fn)
        stderr.on(event, fn)
      }
    }
  }

  return fromEventedStream(stream)
}

export = fromChildProcess
