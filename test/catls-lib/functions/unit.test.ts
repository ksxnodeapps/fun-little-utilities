import { unit, SymlinkResolution, UnitType } from 'catls-lib'
import { UnitParam, HandlerReturn } from '../.lib/unit-param'
import { fsPromise, getStatsPattern, EntName } from '../.lib/fake-file-system-sample'

const init = (
  name: EntName,
  symlinkResolution = SymlinkResolution.Agnostic,
  followSymlink = 0
) => {
  type ResName = keyof typeof HandlerReturn
  type Key = keyof UnitParam
  const param = new UnitParam({ name, followSymlink, symlinkResolution, fsPromise })
  const promise = unit(param)
  const resname: Promise<ResName> = promise.then(x => HandlerReturn[x] as any)
  const mkfn = (fn: (x: ResName) => void) => async () => fn(await resname)
  const calledTimes = (name: Key, times: number) => mkfn(() => expect(param[name]).toBeCalledTimes(times))
  const calledOnce = (name: Key) => calledTimes(name, 1)
  const calledWith = (name: Key, args: any[]) => mkfn(() => expect(param[name]).toBeCalledWith(...args))
  const returns = (code: HandlerReturn) => mkfn(name => expect(name).toBe(HandlerReturn[code]))
  const returnsCode = (code: HandlerReturn) => async () => expect(await promise).toBe(code)
  const ignore = (name: Key) => mkfn(() => expect(param[name]).not.toBeCalled())
  return { param, promise, resname, mkfn, calledTimes, calledOnce, calledWith, returns, returnsCode, ignore }
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

describe('with a symlink', () => {
  describe('that points to a file', () => {
    describe('when resolution is "agnostic"', () => {
      const { param, calledOnce, calledWith, returns, ignore } = init(
        'symlink to existing file 0',
        SymlinkResolution.Agnostic
      )
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

    describe('when resolution is "relative"', () => {
      describe('when followSymlink is 0', () => {
        const { param, calledOnce, calledWith, returns, ignore } = init(
          'symlink to existing file 0',
          SymlinkResolution.Relative,
          0
        )
        it('calls handleSymlink once', calledOnce('handleSymlink'))
        it('calls handleSymlink with expected arguments', calledWith('handleSymlink', [{
          type: UnitType.Symlink,
          content: 'symlink to existing file 1',
          target: 'symlink to existing file 1',
          options: param,
          stats: getStatsPattern('symlink to existing file 0')
        }]))
        it('returns expected value', returns(HandlerReturn.Symlink))
        it('does not call handleNonExist', ignore('handleNonExist'))
        it('does not call handleFile', ignore('handleFile'))
        it('does not call handleDirectory', ignore('handleDirectory'))
        it('does not call handleUnknown', ignore('handleUnknown'))
      })

      describe('when followSymlink is 1', () => {
        const { param, mkfn, calledTimes, returnsCode, ignore } = init(
          'symlink to existing file 0',
          SymlinkResolution.Relative,
          1
        )
        it('calls handleSymlink twice', calledTimes('handleSymlink', 2))
        it('calls handleSymlink with expected arguments', mkfn(() => {
          expect(param.handleSymlink.mock.calls).toEqual([
            [{
              type: UnitType.Symlink,
              content: 'symlink to existing file 1',
              target: 'symlink to existing file 1',
              options: param,
              stats: getStatsPattern('symlink to existing file 0')
            }],
            [{
              type: UnitType.Symlink,
              content: 'symlink to existing file 2',
              target: 'symlink to existing file 2',
              options: param,
              stats: getStatsPattern('symlink to existing file 1')
            }]
          ])
        }))
        it('returns expected value', returnsCode(HandlerReturn.Symlink * 2))
        it('does not call handleNonExist', ignore('handleNonExist'))
        it('does not call handleFile', ignore('handleFile'))
        it('does not call handleDirectory', ignore('handleDirectory'))
        it('does not call handleUnknown', ignore('handleUnknown'))
      })

      describe('when followSymlink is Infinity', () => {
        const { param, mkfn, calledTimes, calledOnce, calledWith, returnsCode, ignore } = init(
          'symlink to existing file 0',
          SymlinkResolution.Relative,
          Infinity
        )
        it('calls handleSymlink as many times as there are symlinks', calledTimes('handleSymlink', 3))
        it('calls handleSymlink with expected arguments', mkfn(() => {
          expect(param.handleSymlink.mock.calls).toEqual([
            [{
              type: UnitType.Symlink,
              content: 'symlink to existing file 1',
              target: 'symlink to existing file 1',
              options: param,
              stats: getStatsPattern('symlink to existing file 0')
            }],
            [{
              type: UnitType.Symlink,
              content: 'symlink to existing file 2',
              target: 'symlink to existing file 2',
              options: param,
              stats: getStatsPattern('symlink to existing file 1')
            }],
            [{
              type: UnitType.Symlink,
              content: 'simple file',
              target: 'simple file',
              options: param,
              stats: getStatsPattern('symlink to existing file 2')
            }]
          ])
        }))
        it('calls handleFile once', calledOnce('handleFile'))
        it('calls handleFile with expected arguments', calledWith('handleFile', [{
          type: UnitType.File,
          options: param,
          stats: getStatsPattern('simple file')
        }]))
        it('returns expected value', returnsCode(HandlerReturn.Symlink * 3 + HandlerReturn.File))
        it('does not call handleNonExist', ignore('handleNonExist'))
        it('does not call handleDirectory', ignore('handleDirectory'))
        it('does not call handleUnknown', ignore('handleUnknown'))
      })
    })

    describe('when resolution is "ultimate"', () => {
      const { param, calledOnce, calledWith, returns, ignore } = init(
        'symlink to existing file 0',
        SymlinkResolution.Ultimate,
        0
      )
      it('calls handleSymlink once', calledOnce('handleSymlink'))
      it('calls handleSymlink with expected arguments', calledWith('handleSymlink', [{
        type: UnitType.Symlink,
        content: 'simple file',
        target: 'simple file',
        options: param,
        stats: getStatsPattern('symlink to existing file 0')
      }]))
      it('returns expected value', returns(HandlerReturn.Symlink))
      it('does not call handleNonExist', ignore('handleNonExist'))
      it('does not call handleFile', ignore('handleFile'))
      it('does not call handleDirectory', ignore('handleDirectory'))
      it('does not call handleUnknown', ignore('handleUnknown'))
    })
  })
})
