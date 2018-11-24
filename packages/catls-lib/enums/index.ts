// tslint:disable:no-unnecessary-qualifier

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
