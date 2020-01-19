import { MaybeArray } from './utils/types'

import {
  CompilerOptions,
  PartialArgs as Settings,
  Program,
  JsonSchemaGenerator,
  Definition
} from 'typescript-json-schema'
export {
  CompilerOptions,
  Settings,
  Program,
  JsonSchemaGenerator,
  Definition
}

/** Formats of output JSON schema files */
export interface OutputDescriptor {
  /** Name of output schema file */
  readonly filename: string
  /** Data format */
  readonly format?: 'json'
  /** JSON indentation */
  readonly indent?: 'tab' | 'none' | number
}

/** Instruction for a single symbol */
export interface SymbolInstruction {
  /** Output descriptor(s) and filename(s) */
  readonly output: MaybeArray<string | OutputDescriptor>
  /** Targeted type name */
  readonly symbol: string
}

/** Shared properties of instruction interfaces */
export interface InstructionSharedProperties {
  /** Compiler options to pass to typescript-json-schema module */
  readonly compilerOptions?: CompilerOptions
  /** Settings to pass to typescript-json-schema module */
  readonly schemaSettings?: Settings
  /** TypeScript source file(s) */
  readonly input?: string | readonly string[]
}

/** Instruction for multiple symbols */
export interface MultiSymbolInstruction extends InstructionSharedProperties {
  /** List of instruction units */
  readonly list?: readonly SymbolInstruction[]

  // omitted properties
  readonly output?: undefined
  readonly symbol?: undefined
}

/** Instruction for a single symbol */
export interface SingleSymbolInstruction extends InstructionSharedProperties, SymbolInstruction {
  // omitted properties
  readonly list?: undefined
}

/** Instruction to generate JSON schemas */
export type Instruction = MultiSymbolInstruction | SingleSymbolInstruction

/** Properties of a configuration file */
export interface Config {
  /** Required generator in npm range syntax (this is for compatibility checking) */
  readonly generator: string
  /** File(s) to inherit from */
  readonly extends?: string | readonly string[]
  /** Instruction to generate JSON schemas */
  readonly instruction: Instruction
}
