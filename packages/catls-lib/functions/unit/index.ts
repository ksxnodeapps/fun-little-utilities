import { Unit } from '../../types'
import { UnitType } from '../../enums'
import relativeLink from '../relative-link'
const { Exception, Symlink, File, Directory, Unknown } = UnitType

type PromiseValue<Type> =
  Type extends Promise<infer Value> ? Value : Type

async function asyncCall<
  Function extends (...args: any[]) => any
> (
  fn: Function,
  ...args: Parameters<Function>
): (
  Promise<PromiseValue<ReturnType<Function>>>
) {
  return fn(...args)
}

async function unit (options: Unit.Options): Promise<number> {
  const {
    name,
    heading,
    handleException,
    handleSymlink,
    handleFile,
    handleDirectory,
    handleUnknown,
    followSymlink,
    getLink,
    getStat,
    getLoop,
    addStatusCode
  } = options

  const main: Unit.LoopBody = async (name, followSymlink, visited) => {
    await heading({ name, options })

    const maybeStats = await asyncCall(getStat, name).then(
      stats => ({ stats }),
      error => ({ error })
    )

    if ('error' in maybeStats) {
      return handleException({
        type: Exception,
        error: maybeStats.error,
        options
      })
    }

    const { stats } = maybeStats

    if (stats.isSymbolicLink()) {
      const maybeContent = await asyncCall(getLink, name).then(
        content => ({ content }),
        error => ({ error })
      )

      if ('error' in maybeContent) {
        return handleException({
          type: Exception,
          error: maybeContent.error,
          options
        })
      }

      const { content } = maybeContent
      const target = relativeLink(name, content)

      const status = await handleSymlink({
        type: Symlink,
        content,
        target,
        options,
        stats
      })

      if (followSymlink && !visited.includes(target)) {
        return addStatusCode(
          status,
          await loop(target, followSymlink - 1, [target, ...visited])
        )
      }

      return status
    }

    if (stats.isFile()) {
      return handleFile({
        type: File,
        options,
        stats
      })
    }

    if (stats.isDirectory()) {
      return handleDirectory({
        type: Directory,
        options,
        stats
      })
    }

    return handleUnknown({
      type: Unknown,
      options,
      stats
    })
  }

  const loop = getLoop(main)

  return main(name, followSymlink, [])
}

export = unit
