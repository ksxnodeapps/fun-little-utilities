import * as types from './types'
import SplitterObject from './splitter-object'
import fromIterableStream from './from-iterable-stream'
import iterateEventedStream from 'iterate-evented-stream'

export const fromEventedStream = <Chunk extends string | Buffer>(stream: types.EventedStream<Chunk>): SplitterObject =>
  fromIterableStream({ [Symbol.asyncIterator]: () => iterateEventedStream(stream) })

export default fromEventedStream
