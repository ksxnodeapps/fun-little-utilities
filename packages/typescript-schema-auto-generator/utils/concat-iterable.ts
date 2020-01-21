export function * concatIterable<Item> (a: Iterable<Item>, b: Iterable<Item>) {
  yield * a
  yield * b
}

export default concatIterable
