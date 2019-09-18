export type MaybePromise<Value> = Value | Promise<Value>

export interface StatReturn {
  readonly isDirectory: () => boolean
}

export interface DeepParam<Path, DirName, BaseName> {
  level: number
  basename: BaseName
  path: Path
  container: DirName
}

export interface Options<
  DirectoryList extends Iterable<BaseName>,
  Path = string,
  DirName = Path,
  BaseName = Path
> {
  readonly dirname: DirName
  readonly readdir: (dirname: DirName) => MaybePromise<DirectoryList>
  readonly stat: (path: Path) => MaybePromise<StatReturn>
  readonly join: (container: DirName, basename: BaseName) => Path
  readonly deep?: (param: DeepParam<Path, DirName, BaseName>) => MaybePromise<boolean>
  readonly level?: number
}
