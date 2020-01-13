import { splitCharacterIterable } from 'string-stream-utils'
import { getAsyncArray } from './lib/async-array'

it('works', async () => {
  async function * getCharIter () {
    yield * 'abc,def,ghi'
  }
  const splitted = splitCharacterIterable(getCharIter(), ',')
  expect(await getAsyncArray(splitted)).toEqual(['abc', 'def', 'ghi'])
})
