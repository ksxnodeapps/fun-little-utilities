// tslint:disable:no-unnecessary-qualifier

export enum ExitStatus {
  Success = 0,
  UncaughtException = 1,
  InsufficientArguments = 2,
  NoEnt = 3,
  UnknownError = 127,
}

export enum EmptyArgumentHandlingMethod {
  Quiet = 'quiet',
  Warn = 'warn',
  Error = 'error',
}

export enum UnitType {
  Exception,
  Symlink,
  File,
  Directory,
  Unknown = -1,
}

export namespace UnitType {
  export type Exist = UnitType.Symlink | UnitType.File | UnitType.Directory | UnitType.Unknown
  export type Known = UnitType.Exception | UnitType.Symlink | UnitType.File | UnitType.Directory
}

export enum SymlinkResolution {
  Agnostic = 'agnostic',
  Relative = 'relative',
  Ultimate = 'ultimate',
}

export enum UnknownStatTypeName {
  BlockDevice = 'BlockDevice',
  CharacterDevice = 'CharacterDevice',
  FIFO = 'FIFO',
  Socket = 'Socket',
  Unknown = 'Unknown',
}
