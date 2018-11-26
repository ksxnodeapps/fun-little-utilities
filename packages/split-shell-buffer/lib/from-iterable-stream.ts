import * as types from './types'
import fromIterable from './from-iterable'
import SplitterObject from './splitter-object'

function fromIterableStream (stream: types.IterableStream): SplitterObject {
  async function * iterate () {
    for await (const chunk of stream) {
      for (const char of Buffer.from(chunk as Buffer)) {
        yield char
      }
    }
  }

  const data = {
    [Symbol.asyncIterator]: iterate
  }

  return fromIterable(data)
}

export = fromIterableStream
