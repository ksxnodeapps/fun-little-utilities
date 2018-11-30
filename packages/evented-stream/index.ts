import * as types from 'evented-stream-types'
import iterateEventedStream from 'iterate-evented-stream'
import combineEventedStream from 'combine-evented-stream'

export * from 'evented-stream-types'
export { iterateEventedStream, combineEventedStream, types }

export const iterate = iterateEventedStream
export const combine = combineEventedStream
