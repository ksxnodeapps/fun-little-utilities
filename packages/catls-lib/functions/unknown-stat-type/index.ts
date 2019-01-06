import { UnknownStatTypeName } from '../../enums'
import { UnknownStatType } from '../../types'
const { BlockDevice, CharacterDevice, FIFO, Socket, Unknown } = UnknownStatTypeName

function unknownStatType (stats: UnknownStatType.Stats): UnknownStatTypeName {
  if (stats.isBlockDevice()) return BlockDevice
  if (stats.isCharacterDevice()) return CharacterDevice
  if (stats.isFIFO()) return FIFO
  if (stats.isSocket()) return Socket
  return Unknown
}

export = unknownStatType
