export type MaybeAsyncIterable<Value> = Iterable<Value> | AsyncIterable<Value>
export type Stream = MaybeAsyncIterable<string>

export async function * splitCharacterIterable (iterable: Stream, sepChar: string) {
  let acc = ''

  for await (const char of iterable) {
    if (char === sepChar) {
      yield acc
      acc = ''
    } else {
      acc += char
    }
  }

  yield acc
}

export const iterateLines = (stream: Stream) => splitCharacterIterable(stream, '\n')

export async function * trimmedChunks (stream: Stream) {
  for await (const chunk of stream) {
    const trimmed = chunk.trim()
    if (trimmed) yield trimmed
  }
}
