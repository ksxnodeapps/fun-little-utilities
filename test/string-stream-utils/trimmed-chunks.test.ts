import { trimmedChunks } from 'string-stream-utils'
import { getAsyncArray } from './lib/async-array'

async function* getStream() {
  yield 'abc'
  yield ''
  yield ' def '
  yield '  \t\n '
  yield 'ghi  \n'
  yield '  \t   jkl'
}

it('yields expected chunks', async () => {
  const chunks = trimmedChunks(getStream())
  expect(await getAsyncArray(chunks)).toEqual(['abc', 'def', 'ghi', 'jkl'])
})

it('does not yield empty string', async () => {
  const chunks = trimmedChunks(getStream())
  expect(await getAsyncArray(chunks)).not.toContain('')
})
