import { Main } from '../../types'
import { ExitStatus, EmptyArgumentHandlingMethod } from '../../enums'
import unit from '../unit'
import str2num from '../string-to-number'
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
    addStatusCode,
    spawn,
    fsPromise
  } = param

  const { readlink } = fsPromise

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

  const actualFollowSymlink = str2num(followSymlink)
  const { getLink, getLoop, getStat } = symlinkRoutingFunctions(symlinkResolution, fsPromise)
  const execute = executor({ dontFakeInteractive, spawn })
  let currentStatus = 0

  // Don't run unit(...) in parallel:
  //   They all write data to process.{stdout,stderr}
  for (const name of list) {
    const statusAddend = await unit({
      heading (param) {
        const heading = `📁 Item: ${param.name}`
        const rule = '—'.repeat(heading.length)
        stdout.write(`\n${rule}\n${heading}\n\n`)
      },

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
        stdout.write('[DATA]\n')
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

      followSymlink: actualFollowSymlink,
      getLink,
      getStat,
      getLoop,
      name,
      addStatusCode,
      fsPromise
    })

    currentStatus = await addStatusCode(currentStatus, statusAddend)
  }

  return currentStatus
}

export = main
