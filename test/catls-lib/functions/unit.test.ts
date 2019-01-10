import { unit, SymlinkResolution, UnitType } from 'catls-lib'
import { UnitParam, HandlerReturn } from '../.lib/unit-param'
import { fsPromise, getStatsPattern } from '../.lib/fake-file-system-sample'

const init = (
  name: string,
  followSymlink = 0,
  symlinkResolution = SymlinkResolution.Agnostic
) => {
  type ResName = keyof typeof HandlerReturn
  const param = new UnitParam({ name, followSymlink, symlinkResolution, fsPromise })
  const promise = unit(param)
  const resname: Promise<ResName> = promise.then(x => HandlerReturn[x] as any)
  const mkfn = (fn: (x: ResName) => void) => async () => fn(await resname)
  const ignore = (name: keyof UnitParam) => mkfn(() => expect(param[name]).not.toBeCalled())
  return { param, promise, resname, mkfn, ignore }
}

describe('with something that does not exist', () => {
  const { param, mkfn, ignore } = init('not exist')

  it('calls options.handleNonExist once', mkfn(() => {
    expect(param.handleNonExist).toBeCalledTimes(1)
  }))

  it('calls options.handleNonExist with expected arguments', mkfn(() => {
    expect(param.handleNonExist).toBeCalledWith({
      type: UnitType.NonExist,
      options: param
    })
  }))

  it('returns expected value', mkfn(value => {
    expect(value).toBe(HandlerReturn[HandlerReturn.NonExist])
  }))

  it('does not call handleSymlink', ignore('handleSymlink'))
  it('does not call handleFile', ignore('handleFile'))
  it('does not call handleDirectory', ignore('handleDirectory'))
  it('does not call handleUnknown', ignore('handleUnknown'))
})

describe('with a file', () => {
  const { param, mkfn, ignore } = init('simple file')

  it('calls options.handleFile once', mkfn(() => {
    expect(param.handleFile).toBeCalledTimes(1)
  }))

  it('calls options.handleFile with expected arguments', mkfn(() => {
    expect(param.handleFile).toBeCalledWith({
      type: UnitType.File,
      options: param,
      stats: getStatsPattern('simple file')
    })
  }))

  it('returns expected value', mkfn(value => {
    expect(value).toBe(HandlerReturn[HandlerReturn.File])
  }))

  it('does not call handleNonExist', ignore('handleNonExist'))
  it('does not call handleSymlink', ignore('handleSymlink'))
  it('does not call handleDirectory', ignore('handleDirectory'))
  it('does not call handleUnknown', ignore('handleUnknown'))
})

describe('with a directory', () => {
  const { param, mkfn, ignore } = init('simple directory')

  it('calls options.handleDirectory once', mkfn(() => {
    expect(param.handleDirectory).toBeCalledTimes(1)
  }))

  it('calls options.handleDirectory with expected arguments', mkfn(() => {
    expect(param.handleDirectory).toBeCalledWith({
      type: UnitType.Directory,
      options: param,
      stats: getStatsPattern('simple directory')
    })
  }))

  it('returns expected value', mkfn(value => {
    expect(value).toBe(HandlerReturn[HandlerReturn.Directory])
  }))

  it('does not call handleNonExist', ignore('handleNonExist'))
  it('does not call handleSymlink', ignore('handleSymlink'))
  it('does not call handleFile', ignore('handleFile'))
  it('does not call handleUnknown', ignore('handleUnknown'))
})
