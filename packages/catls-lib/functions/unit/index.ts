import { existsSync } from 'fs-extra'
import { Unit } from '../../types'
import { UnitType } from '../../enums'
import relativeLink from '../relative-link'
const { NonExist, Symlink, File, Directory, Unknown } = UnitType

function unit (options: Unit.Options): Promise<void> {
  interface MainParam extends Unit.Options {
    readonly followSymlink: number
    readonly visited: ReadonlyArray<string>
  }

  const {
    followSymlink = 0,
    ...rest
  } = options

  async function main (options: MainParam): Promise<void> {
    const {
      name,
      handle,
      followSymlink,
      getLink,
      getStat,
      visited
    } = options

    if (!existsSync(name)) {
      return handle({
        type: NonExist,
        options
      })
    }

    const stats = await getStat(name)

    if (stats.isSymbolicLink()) {
      const content = await getLink(name)
      const target = relativeLink(name, content)

      await handle({
        type: Symlink,
        content,
        target,
        options,
        stats
      })

      if (followSymlink && !visited.includes(target)) {
        return main({
          ...options,
          name: target,
          followSymlink: followSymlink - 1,
          visited: [target, ...visited]
        })
      }

      return
    }

    if (stats.isFile()) {
      return handle({
        type: File,
        options,
        stats
      })
    }

    if (stats.isDirectory()) {
      return handle({
        type: Directory,
        options,
        stats
      })
    }

    return handle({
      type: Unknown,
      options,
      stats
    })
  }

  return main({
    visited: [],
    followSymlink,
    ...rest
  })
}

export = unit
