import { unknownStatType, UnknownStatType, UnknownStatTypeName } from 'catls-lib'
const { BlockDevice, CharacterDevice, FIFO, Socket, Unknown } = UnknownStatTypeName

function createStatObject (type: UnknownStatTypeName): UnknownStatType.Stats {
  const mkfn = (expected: UnknownStatTypeName) => () => type === expected
  const isBlockDevice = mkfn(BlockDevice)
  const isCharacterDevice = mkfn(CharacterDevice)
  const isFIFO = mkfn(FIFO)
  const isSocket = mkfn(Socket)
  return { isBlockDevice, isCharacterDevice, isFIFO, isSocket }
}

const unit = (expected: UnknownStatTypeName) => () => {
  const stats = createStatObject(expected)
  const received = unknownStatType(stats)
  expect(received).toBe(expected)
}

it('when stats.isBlockDevice() is true', unit(BlockDevice))
it('when stats.isCharacterDevice() is true', unit(CharacterDevice))
it('when stats.isFIFO() is true', unit(FIFO))
it('when stats.isSocket() is true', unit(Socket))
it('when none of the methods return true', unit(Unknown))
