import { iterateCharacters } from 'string-stream-utils'
import { getAsyncArray } from './lib/async-array'

export const getString = () => 'abcdefghi' as const
export const getStringArray = () => ['abc', 'def', 'ghi'] as const

export function* getStringIterator() {
  yield 'abc' as const
  yield 'def' as const
  yield 'ghi' as const
}

export async function* getStringAsyncIterator() {
  yield* getStringIterator()
}

export const getStringIterable = (): Iterable<string> => ({
  [Symbol.iterator]: getStringIterator,
})

export const getStringAsyncIterable = (): AsyncIterable<string> => ({
  [Symbol.asyncIterator]: getStringAsyncIterator,
})

it('string', async () => {
  const text = getString()
  expect(await getAsyncArray(iterateCharacters(text))).toEqual([...'abcdefghi'])
})

it('array of strings', async () => {
  const array = getStringArray()
  expect(await getAsyncArray(iterateCharacters(array))).toEqual([...'abcdefghi'])
})

it('iterator of strings', async () => {
  const iterator = getStringIterator()
  expect(await getAsyncArray(iterateCharacters(iterator))).toEqual([...'abcdefghi'])
})

it('async iterator of strings', async () => {
  const iterator = getStringAsyncIterator()
  expect(await getAsyncArray(iterateCharacters(iterator))).toEqual([...'abcdefghi'])
})

it('iterable of strings', async () => {
  const iterable = getStringIterable()
  expect(await getAsyncArray(iterateCharacters(iterable))).toEqual([...'abcdefghi'])
})

it('async iterable of strings', async () => {
  const iterable = getStringAsyncIterable()
  expect(await getAsyncArray(iterateCharacters(iterable))).toEqual([...'abcdefghi'])
})
