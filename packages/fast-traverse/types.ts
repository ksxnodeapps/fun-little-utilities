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
  BaseName = Path
> {
  readonly dirname: Path
  readonly readdir: (dirname: Path) => MaybePromise<DirectoryList>
  readonly stat: (path: Path) => MaybePromise<StatReturn>
  readonly join: (container: Path, basename: BaseName) => Path
  readonly deep?: (param: DeepParam<Path, Path, BaseName>) => MaybePromise<boolean>
  readonly level?: number
}
