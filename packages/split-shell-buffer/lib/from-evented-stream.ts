import * as types from './types'
import SplitterObject from './splitter-object'
import fromIterableStream from './from-iterable-stream'

function fromEventedStream (stream: types.EventedStream): SplitterObject {
  let queue = Promise.resolve()

  function addQueue (fn: () => void) {
    queue = queue.then(fn)
  }

  const iterate = (): AsyncIterableIterator<Buffer> => ({
    next: () => new Promise((resolve, reject) => {
      stream.on('data', value => addQueue(
        () => resolve({ done: false, value })
      ))

      stream.on('error', error => addQueue(
        () => reject(error)
      ))

      stream.on('close', () => addQueue(
        () => resolve({ done: true, value: undefined as any })
      ))
    }),

    // I could let the function returns 'this'
    // but the code ends up never being called
    // making holes in coverage reports
    // so I assign it to 'undefined as any'
    // to please both TSC and coverage
    [Symbol.asyncIterator]: undefined as any
  })

  return fromIterableStream({
    [Symbol.asyncIterator]: iterate
  })
}

export = fromEventedStream
