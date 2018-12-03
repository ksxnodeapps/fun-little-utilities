import { UnknownStatInfo } from '../../types'

function unknownStatType (stats: UnknownStatInfo.Stats): string {
  if (stats.isBlockDevice()) return 'BlockDevice'
  if (stats.isCharacterDevice()) return 'CharacterDevice'
  if (stats.isFIFO()) return 'FIFO'
  if (stats.isSocket()) return 'Socket'
  return 'Unknown'
}

export = unknownStatType
