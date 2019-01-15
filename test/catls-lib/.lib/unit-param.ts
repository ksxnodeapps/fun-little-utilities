import {
  symlinkRoutingFunctions,
  Unit,
  SymlinkResolution,
  SymlinkRoutingFunctions
} from 'catls-lib'

export enum HandlerReturn {
  NonExist = 2,
  Symlink = 3,
  File = 5,
  Directory = 7,
  Unknown = 11
}

export class UnitParamSharedProperties {
  public readonly addStatusCode: Unit.Options.StatusCodeAdder = (a, b) => a + b
  public readonly heading = jest.fn(() => undefined)
  public readonly handleNonExist = jest.fn(() => HandlerReturn.NonExist)
  public readonly handleSymlink = jest.fn(() => HandlerReturn.Symlink)
  public readonly handleFile = jest.fn(() => HandlerReturn.File)
  public readonly handleDirectory = jest.fn(() => HandlerReturn.Directory)
  public readonly handleUnknown = jest.fn(() => HandlerReturn.Unknown)
}

export class UnitParam extends UnitParamSharedProperties implements Unit.Options {
  public readonly fsPromise: UnitParam.FileSystemFunctions
  public readonly name: string
  public readonly followSymlink: number
  public readonly getLink: jest.Mock<any>
  public readonly getStat: jest.Mock<any>
  public readonly getLoop: jest.Mock<any>

  constructor (options: UnitParam.ConstructorOptions) {
    super()

    this.fsPromise = options.fsPromise
    this.name = options.name
    this.followSymlink = options.followSymlink

    const fns = symlinkRoutingFunctions(options.symlinkResolution, options.fsPromise)
    this.getLink = jest.fn(fns.getLink)
    this.getStat = jest.fn(fns.getStat)
    this.getLoop = jest.fn(fns.getLoop)
  }
}

export namespace UnitParam {
  export interface ConstructorOptions {
    readonly fsPromise: FileSystemFunctions
    readonly name: string
    readonly symlinkResolution: SymlinkResolution
    readonly followSymlink: number
  }

  export type FileSystemFunctions =
    Unit.Options.FileSystemFunctions &
    SymlinkRoutingFunctions.FileSystemFunctions
}
