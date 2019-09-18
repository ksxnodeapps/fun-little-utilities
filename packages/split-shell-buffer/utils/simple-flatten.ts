export function * simpleFlatten<Element> (container: Iterable<Iterable<Element>>) {
  for (const iterable of container) {
    yield * iterable
  }
}

export default simpleFlatten
