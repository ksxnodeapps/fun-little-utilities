import { Unit } from '../../types'
import { UnitType } from '../../enums'
import relativeLink from '../relative-link'
const { NonExist, Symlink, File, Directory, Unknown } = UnitType

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
    handleNonExist,
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
      const { error } = maybeStats

      if (error.code === 'ENOENT') {
        return handleNonExist({
          type: NonExist,
          error,
          options
        })
      }

      // TODO: make handleError
      throw error
    }

    const { stats } = maybeStats

    if (stats.isSymbolicLink()) {
      const content = await getLink(name)
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
