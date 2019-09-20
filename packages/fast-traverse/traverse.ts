import { Options } from './types'

export const DEFAULT_DEEP = () => true as const

export class Item<
  BaseName,
  DirName,
  DirectoryList
> {
  constructor (
    public readonly basename: BaseName,
    public readonly dirname: DirName,
    public readonly list: DirectoryList,
    public readonly level: number
   ) {}
}

type Return<BaseName, DirName, DirectoryList> = AsyncGenerator<Item<BaseName, DirName, DirectoryList>>

export async function * traverse<
  DirectoryList extends Iterable<BaseName>,
  Path = string,
  BaseName = Path
> (options: Options<DirectoryList, Path, BaseName>): Return<BaseName | undefined, Path, DirectoryList> {
  const {
    dirname,
    basename,
    readdir,
    stat,
    join,
    deep = DEFAULT_DEEP,
    level = 0
  } = options

  const dirs = await readdir(dirname)
  yield new Item(basename, dirname, dirs, level)

  for (const basename of dirs) {
    const path = join(dirname, basename)
    const statReturn = await stat(path)
    if (!statReturn.isDirectory()) continue

    const deepReturn = await deep({
      basename,
      path,
      level,
      container: dirname
    })
    if (!deepReturn) continue

    yield * traverse({
      readdir,
      stat,
      join,
      deep,
      basename,
      dirname: path,
      level: level + 1
    })
  }
}

export default traverse
