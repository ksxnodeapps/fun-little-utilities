import { createAsyncIterableIterator, IteratorResultLike } from 'construct-iterator'
import * as types from './types'
import SplitterObject from './splitter-object'
import fromIterableStream from './from-iterable-stream'

function fromEventedStream (stream: types.EventedStream): SplitterObject {
  let queue = Promise.resolve()

  function addQueue (fn: () => void) {
    queue = queue.then(fn)
  }

  const iterate = () => createAsyncIterableIterator(
    () => new Promise<IteratorResultLike<string | Buffer>>((resolve, reject) => {
      stream.on('data', value => addQueue(
        () => resolve({ done: false, value })
      ))

      stream.on('error', error => addQueue(
        () => reject(error)
      ))

      stream.on('close', () => addQueue(
        () => resolve({ done: true })
      ))
    })
  )

  return fromIterableStream({
    [Symbol.asyncIterator]: iterate
  })
}

export = fromEventedStream
