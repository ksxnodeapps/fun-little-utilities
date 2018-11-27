import './polyfill'
export * from './lib/types'

import createIterableIterator from './lib/create-iterable-iterator'
import createIteratorResult from './lib/create-iterator-result'
import createNextFunc from './lib/create-next-func'
import createAsyncIterableIterator from './lib/create-async-iterable-iterator'
import createAsyncIteratorResult from './lib/create-async-iterator-result'
import createAsyncNextFunc from './lib/create-async-next-func'
import IterableIteratorInstance from './lib/iterable-iterator-instance'
import IteratorInstance from './lib/iterator-instance'
import IteratorResultInstance from './lib/iterator-result-instance'
import AsyncIterableIteratorInstance from './lib/async-iterable-iterator-instance'
import AsyncIteratorInstance from './lib/async-iterator-instance'
import AsyncIteratorResultInstance from './lib/async-iterator-result-instance'

export {
  createIterableIterator,
  createIteratorResult,
  createNextFunc,
  createAsyncIterableIterator,
  createAsyncIteratorResult,
  createAsyncNextFunc,
  IterableIteratorInstance,
  IteratorInstance,
  IteratorResultInstance,
  AsyncIterableIteratorInstance,
  AsyncIteratorInstance,
  AsyncIteratorResultInstance
}
