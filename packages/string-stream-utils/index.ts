export type MaybeAsyncIterable<Value> = Iterable<Value> | AsyncIterable<Value>
export type Stream = MaybeAsyncIterable<string>

export async function * iterateCharacters (stream: Stream) {
  for await (const chunk of stream) {
    yield * chunk
  }
}

export async function * splitCharacterIterable (chars: MaybeAsyncIterable<string>, sepChar: string) {
  let acc = ''

  for await (const char of chars) {
    if (char === sepChar) {
      yield acc
      acc = ''
    } else {
      acc += char
    }
  }

  yield acc
}

export const splitStream = (stream: Stream, sepChar: string) =>
  splitCharacterIterable(iterateCharacters(stream), sepChar)

export const iterateLines = (stream: Stream) => splitStream(stream, '\n')

export async function * trimmedChunks (stream: Stream) {
  for await (const chunk of stream) {
    const trimmed = chunk.trim()
    if (trimmed) yield trimmed
  }
}
