import path from 'path'

export function mockPath () {
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
        .split(SEP)
        .filter(Boolean)
        .slice(0, -1)
        .join(SEP)
    )

  const isAbsolute = jest
    .spyOn(path, 'isAbsolute')
    .mockImplementation((path: string) => path.startsWith('/'))

  const restore = () => {
    sep.mockRestore()
    dirname.mockRestore()
    isAbsolute.mockRestore()
  }

  return {
    spy: {
      sep,
      dirname,
      isAbsolute
    },
    restore
  }
}

export default mockPath
