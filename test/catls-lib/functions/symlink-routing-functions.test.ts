import { symlinkRoutingFunctions, SymlinkResolution, SymlinkRoutingFunctions } from 'catls-lib'
import FileSystemFunctions = SymlinkRoutingFunctions.FileSystemFunctions
const { Agnostic, Relative, Ultimate } = SymlinkResolution

function initGetLoop (getLoop: SymlinkRoutingFunctions.LoopGetter) {
  const name = 'name'
  const followSymlink = 4
  const visited: ReadonlyArray<string> = []
  const expectedReturn = Symbol('BodyReturn')
  const fn = (a: string, b: number, c: any) => b > 0 ? loop(a, b - 1, c) : expectedReturn
  const body = jest.fn(fn)
  const loop = getLoop(body)
  const receivedReturn = loop(name, followSymlink, visited)
  return { name, followSymlink, visited, body, loop, expectedReturn, receivedReturn }
}

class FakeFileSystemFunctions implements FileSystemFunctions {
  public readonly stat = jest.fn()
  public readonly lstat = jest.fn()
  public readonly readlink = jest.fn()
  public readonly realpath = jest.fn()
}

describe(`when resolution is ${Agnostic}`, () => {
  const fsfn = new FakeFileSystemFunctions()
  const result = symlinkRoutingFunctions(Agnostic, fsfn)

  it('result matches snapshot', () => {
    expect(result).toMatchSnapshot()
  })

  it('result.getStat is fsfn.stat', () => {
    expect(result.getStat).toBe(fsfn.stat)
  })

  it('result.getLink is not a function', () => {
    expect(result.getLink).not.toEqual(expect.any(Function))
  })

  it('result.getLoop is () => () => 0', () => {
    const getLoop: any = result.getLoop
    expect(getLoop()()).toBe(0)
  })
})

describe(`when resolution is ${Relative}`, () => {
  const fsfn = new FakeFileSystemFunctions()
  const result = symlinkRoutingFunctions(Relative, fsfn)

  it('result matches snapshot', () => {
    expect(result).toMatchSnapshot()
  })

  it('result.getStat is fsfn.lstat', () => {
    expect(result.getStat).toBe(fsfn.lstat)
  })

  it('result.getLink is fsfn.readlink', () => {
    expect(result.getLink).toBe(fsfn.readlink)
  })

  describe('result.getLoop()', () => {
    const { getLoop } = result

    it('calls body with expected arguments', () => {
      const { body, name, followSymlink, visited } = initGetLoop(getLoop)
      expect(body).toBeCalledWith(name, followSymlink, visited)
    })

    it('calls body for expected number of times', () => {
      const { body, followSymlink } = initGetLoop(getLoop)
      expect(body).toBeCalledTimes(followSymlink + 1)
    })

    it('returns expected value', async () => {
      const { receivedReturn, expectedReturn } = initGetLoop(getLoop)
      expect(await receivedReturn).toBe(expectedReturn)
    })
  })
})

describe(`when resolution is ${Ultimate}`, () => {
  const fsfn = new FakeFileSystemFunctions()
  const result = symlinkRoutingFunctions(Ultimate, fsfn)

  it('result matches snapshot', () => {
    expect(result).toMatchSnapshot()
  })

  it('result.getStat is fsfn.lstat', () => {
    expect(result.getStat).toBe(fsfn.lstat)
  })

  it('result.getLink is fsfn.realpath', () => {
    expect(result.getLink).toBe(fsfn.realpath)
  })

  describe('result.getLoop()', () => {
    const { getLoop } = result

    it('calls body with (name, 0, [])', () => {
      const { body, name } = initGetLoop(getLoop)
      expect(body).toBeCalledWith(name, 0, [])
    })

    it('calls body only once', () => {
      const { body } = initGetLoop(getLoop)
      expect(body).toBeCalledTimes(1)
    })

    it('return expected values', async () => {
      const { receivedReturn, expectedReturn } = initGetLoop(getLoop)
      expect(await receivedReturn).toBe(expectedReturn)
    })
  })
})
