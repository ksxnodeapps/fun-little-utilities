export type MaybeAsyncIterable<X> = Iterable<X> | AsyncIterable<X>
export type SPLITTER = typeof SPLITTER

export const SPLITTER = Symbol('SPLITTER')
export const sep = (x: any) => x === SPLITTER
export const asyncSep = async (x: any) => sep(x)

export function args2arr<Args extends ReadonlyArray<string | number | symbol>> (...args: Args) {
  return args
}

export async function getArrayFromAsyncIterable<X> (iterable: MaybeAsyncIterable<X>) {
  const array = Array<X>()
  for await (const item of iterable) {
    array.push(item)
  }
  return array
}

export async function * asyncIterate<X> (iterable: Iterable<X>) {
  yield * iterable
}

export function assertResemble<X> (
  iterable: Iterable<X | SPLITTER>,
  splitResult: ReadonlyArray<ReadonlyArray<X>>
) {
  const arrayWithoutSplitter = Array.from(iterable).filter((x): x is X => x !== SPLITTER)
  const splitResultJoined = splitResult.reduce((prev, current) => prev.concat(current), [])
  expect(splitResultJoined).toEqual(arrayWithoutSplitter)
}

export function assertNoSplitter<X> (splitResult: ReadonlyArray<ReadonlyArray<X>>) {
  expect(splitResult).not.toContainEqual(expect.arrayContaining([SPLITTER]))
}
