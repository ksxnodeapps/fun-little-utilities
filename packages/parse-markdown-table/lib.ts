import { Stream, iterateLines, trimmedChunks } from 'string-stream-utils'
import { ArrayTable, ObjectTable, createObjectTable, createObjectTableSync } from 'table-parser-base'

export { Stream }
export { ArrayTable, ObjectTable }
export * from 'table-parser-base'

export interface TableIterationOptions {
  readonly leftBound: boolean
  readonly rightBound: boolean
}

const horizontalLineRegex = /^[|-]+$/

export async function* iterateRows(lines: Stream, options: TableIterationOptions) {
  const { leftBound, rightBound } = options

  for await (const line of lines) {
    const trimmedLine = line.trim()
    if (horizontalLineRegex.test(trimmedLine)) continue

    const row = trimmedLine.split('|').map(x => x.trim())

    if (leftBound && row.shift() !== '') {
      throw new SyntaxError('Inconsistent left bound')
    }

    if (rightBound && row.pop() !== '') {
      throw new SyntaxError('Inconsistent right bound')
    }

    yield row
  }
}

export function* iterateRowsSync(lines: Iterable<string>, options: TableIterationOptions) {
  const { leftBound, rightBound } = options

  for (const line of lines) {
    const trimmedLine = line.trim()
    if (horizontalLineRegex.test(trimmedLine)) continue

    const row = trimmedLine.split('|').map(x => x.trim())

    if (leftBound && row.shift() !== '') {
      throw new SyntaxError('Inconsistent left bound')
    }

    if (rightBound && row.pop() !== '') {
      throw new SyntaxError('Inconsistent right bound')
    }

    yield row
  }
}

export class MarkdownCellTable implements ArrayTable<string, string> {
  constructor(
    public readonly headers: readonly string[],
    public readonly rows: AsyncIterableIterator<readonly string[]>,
  ) {}
}

export class MarkdownCellTableSync implements ArrayTable<string, string> {
  constructor(
    public readonly headers: readonly string[],
    public readonly rows: IterableIterator<readonly string[]>,
  ) {}
}

export async function createMarkdownArrayTable(stream: Stream) {
  const lineIterator = trimmedChunks(iterateLines(stream))
  const firstLineResult = await lineIterator.next()

  if (firstLineResult.done) {
    throw new SyntaxError('Text is empty')
  }

  const headers = firstLineResult.value.split('|').map(x => x.trim())
  const leftBound = headers[0] === ''
  const rightBound = headers[headers.length - 1] === ''
  if (leftBound) headers.shift()
  if (rightBound) headers.pop()

  const rows = iterateRows(lineIterator, { leftBound, rightBound })

  return new MarkdownCellTable(headers, rows)
}

export function createMarkdownArrayTableSync(text: string) {
  const lines = [...text.split('\n')].map(s => s.trim())
  if (lines[0] === '') lines.shift()
  if (lines[lines.length - 1] === '') lines.pop()

  if (lines.length === 0) {
    throw new SyntaxError('Text is empty')
  }

  const headers = lines[0].split('|').map(x => x.trim())
  const leftBound = headers[0] === ''
  const rightBound = headers[headers.length - 1] === ''
  if (leftBound) headers.shift()
  if (rightBound) headers.pop()

  const rows = iterateRowsSync(lines.slice(1), { leftBound, rightBound })

  return new MarkdownCellTableSync(headers, rows)
}

export async function createMarkdownObjectTable(stream: Stream) {
  return createObjectTable(await createMarkdownArrayTable(stream))
}

export function createMarkdownObjectTableSync(text: string) {
  return createObjectTableSync(createMarkdownArrayTableSync(text))
}
