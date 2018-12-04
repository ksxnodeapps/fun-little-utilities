import { readlink } from 'fs-extra'
import { Main } from '../../types'
import { ExitStatus, EmptyArgumentHandlingMethod } from '../../enums'
import unit from '../unit'
import num2str from '../number-to-string'
import symlinkRoutingFunctions from '../symlink-routing-functions'
import statInfo from '../stat-info'
import unknownStatType from '../unknown-stat-type'
import executor from '../executor'
import showExecData from '../show-exec-data'

async function main (param: Main.Param): Promise<number> {
  const {
    list,
    stdout,
    stderr,
    cat,
    ls,
    catArguments,
    lsArguments,
    handleEmptyArguments,
    dontFakeInteractive,
    followSymlink,
    symlinkResolution,
    addStatusCode
  } = param

  if (!list.length) {
    switch (handleEmptyArguments) {
      case EmptyArgumentHandlingMethod.Quiet:
        return ExitStatus.Success
      case EmptyArgumentHandlingMethod.Warn:
        stderr.write('[WARN] Should provide at least 1 argument\n')
        return ExitStatus.Success
      case EmptyArgumentHandlingMethod.Error:
        stderr.write('[ERROR] Must provided at least 1 argument\n')
        return ExitStatus.InsufficientArguments
    }
  }

  const actualFollowSymlink = num2str(followSymlink)
  const { getLink, getLoop, getStat } = symlinkRoutingFunctions(symlinkResolution)
  const execute = executor(dontFakeInteractive)
  let currentStatus = 0

  for (const name of list) {
    const statusAddend = await unit({
      followSymlink: actualFollowSymlink,

      handleNonExist (param) {
        stderr.write(`[ERROR] No such file or directory: ${param.options.name}`)
        return ExitStatus.NoEnt
      },

      async handleSymlink (param) {
        stdout.write(statInfo('Symbolic Link', param.stats, [
          ['Target', param.target],
          ['Data', await readlink(param.options.name)] // don't use param.content for this
        ]))

        return 0
      },

      handleFile (param) {
        stdout.write(statInfo('File', param.stats))
        return showExecData({
          cmd: cat,
          args: [...catArguments, param.options.name],
          writable: stdout,
          execute
        })
      },

      handleDirectory (param) {
        stdout.write(statInfo('Directory', param.stats))
        stdout.write('[CONTENT]\n')
        return showExecData({
          cmd: ls,
          args: [...lsArguments, param.options.name],
          writable: stdout,
          execute
        })
      },

      handleUnknown ({ stats }) {
        stdout.write(statInfo(unknownStatType(stats), stats))
        return 0
      },

      getLink,
      getStat,
      getLoop,
      name,
      addStatusCode
    })

    currentStatus = await addStatusCode(currentStatus, statusAddend)
  }

  return currentStatus
}

export = main
