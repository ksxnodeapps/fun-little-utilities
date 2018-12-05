// tslint:disable:no-unnecessary-qualifier

export enum ExitStatus {
  Success = 0,
  InsufficientArguments = 1,
  NoEnt = 2,
  UncaughtError = 3
}

export enum EmptyArgumentHandlingMethod {
  Quiet = 'quiet',
  Warn = 'warn',
  Error = 'error'
}

export enum UnitType {
  NonExist,
  Symlink,
  File,
  Directory,
  Unknown = -1
}

export namespace UnitType {
  export type Exist = UnitType.Symlink | UnitType.File | UnitType.Directory | UnitType.Unknown
  export type Known = UnitType.NonExist | UnitType.Symlink | UnitType.File | UnitType.Directory
}

export enum SymlinkResolution {
  Agnostic = 'agnostic',
  Relative = 'relative',
  Ultimate = 'ultimate'
}
