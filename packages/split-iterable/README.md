# Split Iterable

Split iterable into multiple chunks

## Usage

### `splitIterable`

```javascript
const { splitIterable } = require('split-iterable')

expect(Array.from(
  splitIterable([0, 'x', 1, 2, 'x', 3, 4, 5])
)).toEqual([
  [0],
  [1, 2],
  [3, 4, 5]
])
```

### `splitAsyncIterable`

```javascript
const { splitAsyncIterable } = require('split-iterable')

const iterable = {
  async * [Symbol.asyncIterator] () {
    yield * [0, 'x', 1, 2, 'x', 3, 4, 5]
  }
}

async function toArray (iterable) {
  let array = []

  for await (const item of iterable) {
    array.push(item)
  }

  return array
}

expect(await toArray(
  splitAsyncIterable(iterable)
)).toEqual([
  [0],
  [1, 2],
  [3, 4, 5]
])
```

## License

[MIT](https://git.io/fxKXN) © [Hoàng Văn Khải](https://github.com/KSXGitHub)
