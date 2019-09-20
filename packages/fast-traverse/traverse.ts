import { Options } from './types'

export const DEFAULT_DEEP = () => true as const

export async function * traverse<
  DirectoryList extends Iterable<BaseName>,
  Path = string,
  BaseName = Path
> (options: Options<DirectoryList, Path, BaseName>): AsyncGenerator<DirectoryList> {
  const {
    dirname,
    readdir,
    stat,
    join,
    deep = DEFAULT_DEEP,
    level = 0
  } = options

  const dirs = await readdir(dirname)
  yield dirs

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
      dirname: path,
      level: level + 1
    })
  }
}

export default traverse
