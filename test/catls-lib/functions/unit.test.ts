import { unit, SymlinkResolution, UnitType } from 'catls-lib'
import { UnitParam, HandlerReturn } from '../.lib/unit-param'
import { fsPromise, getStatsPattern } from '../.lib/fake-file-system-sample'

const init = (
  name: string,
  followSymlink = 0,
  symlinkResolution = SymlinkResolution.Agnostic
) => {
  type ResName = keyof typeof HandlerReturn
  type Key = keyof UnitParam
  const param = new UnitParam({ name, followSymlink, symlinkResolution, fsPromise })
  const promise = unit(param)
  const resname: Promise<ResName> = promise.then(x => HandlerReturn[x] as any)
  const mkfn = (fn: (x: ResName) => void) => async () => fn(await resname)
  const calledOnce = (name: Key) => mkfn(() => expect(param[name]).toBeCalledTimes(1))
  const calledWith = (name: Key, args: any[]) => mkfn(() => expect(param[name]).toBeCalledWith(...args))
  const returns = (code: HandlerReturn) => mkfn(name => expect(name).toBe(HandlerReturn[code]))
  const ignore = (name: Key) => mkfn(() => expect(param[name]).not.toBeCalled())
  return { param, promise, resname, mkfn, calledOnce, calledWith, returns, ignore }
}

describe('with something that does not exist', () => {
  const { param, calledOnce, calledWith, returns, ignore } = init('not exist')
  it('calls options.handleNonExist once', calledOnce('handleNonExist'))
  it('calls options.handleNonExist with expected arguments', calledWith('handleNonExist', [{
    type: UnitType.NonExist,
    options: param
  }]))
  it('returns expected value', returns(HandlerReturn.NonExist))
  it('does not call handleSymlink', ignore('handleSymlink'))
  it('does not call handleFile', ignore('handleFile'))
  it('does not call handleDirectory', ignore('handleDirectory'))
  it('does not call handleUnknown', ignore('handleUnknown'))
})

describe('with a file', () => {
  const { param, calledOnce, calledWith, returns, ignore } = init('simple file')
  it('calls handleFile once', calledOnce('handleFile'))
  it('calls handleFile with expected arguments', calledWith('handleFile', [{
    type: UnitType.File,
    options: param,
    stats: getStatsPattern('simple file')
  }]))
  it('returns expected value', returns(HandlerReturn.File))
  it('does not call handleNonExist', ignore('handleNonExist'))
  it('does not call handleSymlink', ignore('handleSymlink'))
  it('does not call handleDirectory', ignore('handleDirectory'))
  it('does not call handleUnknown', ignore('handleUnknown'))
})

describe('with a directory', () => {
  const { param, calledOnce, calledWith, returns, ignore } = init('simple directory')
  it('calls handleDirectory once', calledOnce('handleDirectory'))
  it('calls handleDirectory with expected arguments', calledWith('handleDirectory', [{
    type: UnitType.Directory,
    options: param,
    stats: getStatsPattern('simple directory')
  }]))
  it('returns expected value', returns(HandlerReturn.Directory))
  it('does not call handleNonExist', ignore('handleNonExist'))
  it('does not call handleSymlink', ignore('handleSymlink'))
  it('does not call handleFile', ignore('handleFile'))
  it('does not call handleUnknown', ignore('handleUnknown'))
})
