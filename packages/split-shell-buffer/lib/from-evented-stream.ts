import { createAsyncIterableIterator, IteratorResultLike, done, undone } from 'construct-iterator'
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
      stream.addListener('data', value => addQueue(
        () => resolve(undone(value))
      ))

      stream.addListener('error', error => addQueue(
        () => reject(error)
      ))

      stream.addListener('close', () => addQueue(
        () => resolve(done)
      ))
    })
  )

  return fromIterableStream({
    [Symbol.asyncIterator]: iterate
  })
}

export = fromEventedStream
