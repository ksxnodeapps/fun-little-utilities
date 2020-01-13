export async function getAsyncArray<Item> (iterable: AsyncIterable<Item>): Promise<Item[]> {
  const array = []

  for await (const item of iterable) {
    array.push(item)
  }

  return array
}
