import flatten from '../utils/simple-flatten'
import * as types from './types'
import elements from './elements'

export async function * lines (splitter: types.Splitter): AsyncIterableIterator<types.Sequence> {
  // workaround https://github.com/palantir/tslint/issues/3997
  // tslint:disable-next-line:await-promise
  for await (const element of elements(splitter)) {
    const { format, reset, main, prefix, suffix } = element
    const flattenFormat: types.Sequence = flatten(format) as any
    yield [...reset, ...prefix, ...flattenFormat, ...main, ...suffix]
  }
}

export default lines
