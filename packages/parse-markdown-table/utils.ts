import iterateEventedStream, { EventedStream } from 'iterate-evented-stream'

export interface StringStream extends EventedStream<string> {}

export async function * iterateStreamCharacters (stream: StringStream) {
  for await (const chunk of iterateEventedStream(stream)) {
    yield * chunk
  }
}

export async function * splitCharacterIterable (iterable: AsyncIterable<string>, sepChar: string) {
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

export function splitCharacterStream (stream: StringStream, sepChar: string) {
  return splitCharacterIterable(
    iterateStreamCharacters(stream),
    sepChar
  )
}

export async function * trimmedStringIterable (iterable: AsyncIterable<string>) {
  for await (const str of iterable) {
    const trimmed = str.trim()
    if (trimmed) yield trimmed
  }
}

export function trimmedStreamLines (stream: StringStream) {
  return trimmedStringIterable(splitCharacterStream(stream, '\n'))
}
