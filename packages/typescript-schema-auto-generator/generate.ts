import ensureArray from './utils/ensure-array'
import getIndent from './utils/get-indent'
import { OutputFileConflict, FileWritingFailure, Success } from './status'
import { listSymbolInstruction } from './instruction'
import { ensureOutputDescriptorArray } from './output-descriptor'
import { TJS, FSX } from './modules'

import {
  Program,
  Definition,
  Instruction,
  SymbolInstruction,
  OutputDescriptor
} from './types'

export interface FileWritingInstruction<Definition> {
  readonly schema: Definition
  readonly instruction: SymbolInstruction
}

export function * generateUnit<
  Prog = Program,
  Def = Definition
> (param: generateUnit.Param<Prog, Def>): generateUnit.Return<Def> {
  const { tjs, instruction, basePath } = param
  const { buildGenerator, getProgramFromFiles } = tjs
  if (!instruction.input) return
  const program = getProgramFromFiles(
    ensureArray(instruction.input),
    instruction.compilerOptions,
    basePath
  )
  const generator = buildGenerator(program, instruction.schemaSettings)

  for (const symbolInstruction of listSymbolInstruction(instruction)) {
    const schema = generator.getSchemaForSymbol(symbolInstruction.symbol)
    yield { instruction: symbolInstruction, schema }
  }
}

export namespace generateUnit {
  export interface Param<Program, Definition> {
    readonly tjs: TJS.Mod<Program, Definition>
    readonly instruction: Instruction
    readonly basePath: string
  }

  export interface Return<Definition>
  extends Generator<FileWritingInstruction<Definition>, void, unknown> {}
}

export const serialize = (schema: any, { indent }: OutputDescriptor) =>
  JSON.stringify(schema, undefined, getIndent(indent))

export async function writeSchemaFile (param: writeSchemaFile.Param): Promise<writeSchemaFile.Return> {
  const { fsx, instruction } = param
  const { schema, instruction: { output } } = instruction
  const descriptors = ensureOutputDescriptorArray(output)
  const duplicationCheckingArray: OutputDescriptor[] = []
  const duplicationMap = new Map<string, OutputDescriptor[]>()
  const writeFuncs: Array<() => Promise<void>> = []

  for (const desc of descriptors) {
    const { filename } = desc

    const duplicatedFiles = descriptors.filter(x => x.filename === filename)
    if (duplicatedFiles.length > 1) {
      duplicationMap.set(filename, duplicatedFiles)
      continue
    }

    duplicationCheckingArray.push(desc)
    writeFuncs.push(() => fsx.writeFile(filename, serialize(schema, desc)))
  }

  if (duplicationMap.size) return new OutputFileConflict(duplicationMap)

  const writeErrors: any[] = []
  await Promise.all(
    writeFuncs.map(fn => fn().catch(error => writeErrors.push(error)))
  )
  if (writeErrors.length) return new FileWritingFailure(writeErrors)

  return new Success(undefined)
}

export namespace writeSchemaFile {
  export interface Param {
    readonly fsx: FSX.Mod
    readonly instruction: FileWritingInstruction<any>
  }

  export type Return =
    OutputFileConflict |
    FileWritingFailure |
    Success<void>
}
