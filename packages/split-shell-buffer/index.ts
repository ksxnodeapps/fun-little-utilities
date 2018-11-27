import 'monorepo-shared-assets/.polyfill'
import SplitterObject from './lib/splitter-object'
import create from './lib/create'
import fromIterable from './lib/from-iterable'
import fromString from './lib/from-string'
import fromIterableStream from './lib/from-iterable-stream'
import fromEventedStream from './lib/from-evented-stream'
import fromChildProcess from './lib/from-child-process'
import toString from './lib/to-string'
import elements from './lib/elements'
import lines from './lib/lines'
import write from './lib/write'
import writeln from './lib/writeln'
import * as errorClasses from './lib/error-classes'
import * as types from './lib/types'

export * from './lib/error-classes'
export * from './lib/types'

export {
  SplitterObject,
  create,
  fromIterable,
  fromString,
  fromIterableStream,
  fromEventedStream,
  fromChildProcess,
  toString,
  elements,
  lines,
  write,
  writeln,
  errorClasses,
  types
}
