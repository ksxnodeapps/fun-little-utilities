export function * concatIterable<Item> (...iterables: Iterable<Item>[]) {
  for (const iterable of iterables) {
    yield * iterable
  }
}

export default concatIterable
