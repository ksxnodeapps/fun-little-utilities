import { iterateLines } from 'string-stream-utils'
import { getAsyncArray } from './lib/async-array'

it('works', async () => {
  async function* getStream() {
    yield 'abc\nde'
    yield 'f\nghi\n'
    yield 'jkl\nmn'
    yield 'o\npqrs'
    yield '\ntuv\nwx'
    yield 'yz'
  }

  const lines = iterateLines(getStream())

  expect(await getAsyncArray(lines)).toEqual([
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
