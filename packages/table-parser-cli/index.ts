import { createArrayTable, createObjectTable } from 'table-parser-base'
import { Console } from 'simple-fake-console'
export { Console, createArrayTable, createObjectTable }

export const enum Type {
  ArrayToObject = 'arr2obj',
  ObjectToArray = 'obj2arr',
}

export interface Process {
  readonly stdin: AsyncIterable<string>
}

export const enum IndentType {
  Tab = 'tab',
  Space = 'space',
  None = 'none',
}

export interface MainParam {
  readonly console: Console
  readonly process: Process
  readonly type: Type
  readonly indentType: IndentType
  readonly indentSize: number
}

export const enum Status {
  Success = 0,
  Failure = 1,
}

export async function main(param: MainParam): Promise<Status> {
  const inputText = await readStdIn(param.process.stdin)
  const inputObject = JSON.parse(inputText)
  const outputObject = await convert(inputObject, param.type)
  const jsonIndent = getIndent(param.indentType, param.indentSize)
  const outputText = JSON.stringify(outputObject, undefined, jsonIndent)
  param.console.info(outputText)
  return 0
}

async function readStdIn(stdin: AsyncIterable<string>) {
  let text = ''
  for await (const chunk of stdin) {
    text += chunk
  }
  return text
}

async function convert(table: any, type: Type) {
  switch (type) {
    case Type.ArrayToObject:
      return getAsyncArray(createObjectTable(table))
    case Type.ObjectToArray:
      return createArrayTable(table)
  }
}

function getIndent(type: IndentType, size: number) {
  switch (type) {
    case IndentType.Space:
      return size
    case IndentType.Tab:
      return '\t' as const
    case IndentType.None:
      return undefined
  }
}

export async function getAsyncArray<Item>(iterable: AsyncIterable<Item>) {
  const array = []
  for await (const item of iterable) {
    array.push(item)
  }
  return array
}
