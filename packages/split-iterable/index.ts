interface SepFunc<Item> {
  (item: Item): boolean
}

export function* splitIterable<Item>(iterable: Iterable<Item>, sep: SepFunc<Item>) {
  let store = Array<Item>()

  for (const item of iterable) {
    if (sep(item)) {
      yield store
      store = []
    } else {
      store.push(item)
    }
  }

  yield store
}

type MaybeAsyncIterable<Item> = Iterable<Item> | AsyncIterable<Item>

interface AsyncSepFunc<Item> {
  (item: Item): boolean | Promise<boolean>
}

export async function* splitAsyncIterable<Item>(
  iterable: MaybeAsyncIterable<Item>,
  sep: AsyncSepFunc<Item>,
) {
  let store = Array<Item>()

  for await (const item of iterable) {
    if (await sep(item)) {
      yield store
      store = []
    } else {
      store.push(item)
    }
  }

  yield store
}
