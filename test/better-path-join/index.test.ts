import { dbg } from 'string-template-format-inspect'
import create from 'better-path-join'

abstract class PathModuleBase {
  abstract readonly isAbsolute: () => boolean
  public readonly join = jest.fn((left: string, right: string) => dbg`path.join(${left}, ${right})`)
}

function setup<Mod extends PathModuleBase>(PathModule: new () => Mod) {
  const pathModule = new PathModule()
  const fn = create(pathModule)
  const left = 'Left'
  const right = 'Right'
  const result = fn(left, right)
  return { pathModule, fn, left, right, result }
}

describe('when path.isAbsolute(right) returns true', () => {
  class PathModule extends PathModuleBase {
    public readonly isAbsolute = jest.fn(() => true)
  }

  it('returns right', () => {
    expect(setup(PathModule).result).toBe('Right')
  })

  it('calls path.isAbsolute once', () => {
    expect(setup(PathModule).pathModule.isAbsolute).toBeCalledTimes(1)
  })

  it('calls path.isAbsolute with right argument', () => {
    expect(setup(PathModule).pathModule.isAbsolute).toBeCalledWith('Right')
  })

  it('does not call path.join', () => {
    expect(setup(PathModule).pathModule.join).not.toBeCalled()
  })
})

describe('when path.isAbsolute(right) returns false', () => {
  class PathModule extends PathModuleBase {
    public readonly isAbsolute = jest.fn(() => false)
  }

  it('returns path.join(left, right)', () => {
    expect(setup(PathModule).result).toBe(new PathModule().join('Left', 'Right'))
  })

  it('calls path.isAbsolute once', () => {
    expect(setup(PathModule).pathModule.isAbsolute).toBeCalledTimes(1)
  })

  it('calls path.isAbsolute with right argument', () => {
    expect(setup(PathModule).pathModule.isAbsolute).toBeCalledWith('Right')
  })

  it('calls path.join once', () => {
    expect(setup(PathModule).pathModule.join).toBeCalledTimes(1)
  })

  it('calls path.join with left and right argument', () => {
    expect(setup(PathModule).pathModule.join).toBeCalledWith('Left', 'Right')
  })
})
