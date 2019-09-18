import * as utils from 'convenient-typescript-utilities'
import { StatInfo } from '../../types'
import tpl = utils.array.tuple

export function statInfo (
  type: string,
  stats: StatInfo.Stats,
  body: ReadonlyArray<[string, string]> = []
): string {
  const head = [
    tpl('Type', type)
  ]

  const tail = [
    tpl('Size', stats.size),
    tpl('Mode', stats.mode),
    tpl('Modified', stats.mtime.toISOString()),
    tpl('Accessed', stats.atime.toISOString()),
    tpl('Changed', stats.ctime.toISOString())
  ]

  const main = [...head, ...body, ...tail]
    .map(([title, value]) => `  ${title}: ${value}`)
    .join('\n')

  return `[INFO]\n${main}\n\n`
}

export default statInfo
