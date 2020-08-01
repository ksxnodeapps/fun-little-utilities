import { createMarkdownArrayTable, createMarkdownObjectTable } from 'parse-markdown-table'
import { Console } from 'simple-fake-console'

export interface ReadableStream extends AsyncIterable<Buffer | string> {}

export const enum Format {
  List = 'list',
  Dict = 'dict',
  JsonLines = 'jsonl',
}

export const enum IndentType {
  Tab = 'tab',
  Space = 'space',
  None = 'none',
}

export interface MainParam {
  readonly console: Console
  readonly stdin: ReadableStream
  readonly format: Format
  readonly indentType: IndentType
  readonly indentSize: number
}

export const enum Status {
  Success = 0,
  Failure = 1,
}

export async function main(options: MainParam): Promise<Status> {
  const indent = getIndentArgument(options.indentType, options.indentSize, options.format)
  const chunks = readStream(options.stdin)

  for await (const object of output(chunks, options.format)) {
    const json = JSON.stringify(object, undefined, indent)
    options.console.info(json)
  }

  return Status.Success
}

function getIndentArgument(type: IndentType, size: number, format: Format): '\t' | number | undefined {
  if (format === Format.JsonLines) return undefined

  switch (type) {
    case IndentType.Tab:
      return '\t'
    case IndentType.Space:
      return size
    case IndentType.None:
      return undefined
  }
}

async function* readStream(stream: ReadableStream) {
  for await (const chunk of stream) {
    yield String(chunk)
  }
}

async function* output(chunks: AsyncIterable<string>, format: Format) {
  switch (format) {
    case Format.Dict:
      yield getAsyncArray(await createMarkdownObjectTable(chunks))
      break
    case Format.List:
      const { headers, rows } = await createMarkdownArrayTable(chunks)
      yield {
        headers,
        rows: await getAsyncArray(rows),
      }
      break
    case Format.JsonLines:
      yield* await createMarkdownObjectTable(chunks)
  }
}

async function getAsyncArray<Item>(iterable: AsyncIterable<Item>) {
  let array = []

  for await (const item of iterable) {
    array.push(item)
  }

  return array
}
