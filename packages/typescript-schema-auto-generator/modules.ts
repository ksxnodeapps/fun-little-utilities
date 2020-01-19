import { CompilerOptions, Settings } from './types'

/** Interfaces of typescript-json-schema */
export namespace TJS {
  export interface Mod<Program, Definition> {
    getProgramFromFiles (files: string[], compilerOptions?: CompilerOptions, basePath?: string): Program
    buildGenerator (program: Program, settings?: Settings): Generator<Definition>
  }

  export interface Generator<Definition> {
    getSchemaForSymbol (symbol: string): Definition
  }
}

/** Interfaces of fs-extra */
export namespace FSX {
  export interface Mod {
    readFile (filename: string): Promise<string>
    writeFile (filename: string, content: string): Promise<void>
  }
}

/** Interfaces of path */
export namespace Path {
  export interface Mod {
    relative (from: string, to: string): string
    join (...paths: string[]): string
  }
}
