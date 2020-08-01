import { splitStream } from 'string-stream-utils'
import { getAsyncArray } from './lib/async-array'

it('works', async () => {
  async function* getStream() {
    yield 'abc,de'
    yield 'f,ghi,'
    yield 'jkl,mn'
    yield 'o,pqrs'
    yield ',tuv,wx'
    yield 'yz'
  }

  const splitted = splitStream(getStream(), ',')

  expect(await getAsyncArray(splitted)).toEqual([
    'abc',
    'def',
    'ghi',
    'jkl',
    'mno',
    'pqrs',
    'tuv',
    'wxyz',
  ])
})
