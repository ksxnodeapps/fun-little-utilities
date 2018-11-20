import path from 'path'
import { PATH_SEP_REGEX } from 'catls-lib'

function mockPath () {
  const OLD_SEP = path.sep
  const SEP = '/'

  // @ts-ignore
  path.sep = SEP
  const sep = {
    mockRestore () {
      // @ts-ignore
      path.sep = OLD_SEP
    }
  }

  const dirname = jest
    .spyOn(path, 'dirname')
    .mockImplementation(
      (path: string) => path
        .split(PATH_SEP_REGEX)
        .filter(Boolean)
        .slice(0, -1)
        .join(SEP)
    )

  const restore = () => {
    sep.mockRestore()
    dirname.mockRestore()
  }

  return {
    spy: {
      sep,
      dirname
    },
    restore
  }
}

export = mockPath
