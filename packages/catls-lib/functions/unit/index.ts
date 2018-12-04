import { existsSync } from 'fs-extra'
import { Unit } from '../../types'
import { UnitType } from '../../enums'
import relativeLink from '../relative-link'
const { NonExist, Symlink, File, Directory, Unknown } = UnitType

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

    if (!existsSync(name)) {
      return handleNonExist({
        type: NonExist,
        options
      })
    }

    const stats = await getStat(name)

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
          await loop(name, followSymlink - 1, [target, ...visited])
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
