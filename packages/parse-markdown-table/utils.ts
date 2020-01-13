export type MaybeAsyncIterable<Value> = Iterable<Value> | AsyncIterable<Value>
export type Stream = MaybeAsyncIterable<string>

export async function * splitStream (iterable: Stream, sepChar: string) {
  let acc = ''

  for await (const chunk of iterable) {
    for (const char of chunk) {
      if (char === sepChar) {
        yield acc
        acc = ''
      } else {
        acc += char
      }
    }
  }

  yield acc
}

export const iterateLines = (stream: Stream) => splitStream(stream, '\n')

export async function * trimmedChunks (stream: Stream) {
  for await (const chunk of stream) {
    const trimmed = chunk.trim()
    if (trimmed) yield trimmed
  }
}
