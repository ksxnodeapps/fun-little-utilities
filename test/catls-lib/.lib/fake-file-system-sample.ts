import FakeFileSystem from './fake-file-system'
import UTCDate from './utc-date'
const { Symlink, File, Directory, BlockDevice, CharacterDevice, FIFO, Socket } = FakeFileSystem

export const fsPromiseDict = {
  'simple file': new File(
    {
      mode: 12,
      atime: new UTCDate(2019, 3, 5),
      ctime: new UTCDate(2020, 7, 4),
      mtime: new UTCDate(2070, 2, 3)
    },
    [
      'This is simple file',
      'Hello, World!!',
      'Foo Bar'
    ].join('\n')
  ),

  'simple directory': new Directory(
    {
      size: 0,
      mode: 15,
      atime: new UTCDate(1999, 10, 2),
      ctime: new UTCDate(2140, 4, 15),
      mtime: new UTCDate(3210, 3, 5)
    },
    [
      'item 0',
      'item 1',
      'item 2'
    ]
  ),

  'symlink to existing file 0': new Symlink(
    {
      size: 3,
      mode: 77,
      atime: new UTCDate(4545, 10, 5),
      ctime: new UTCDate(2562, 9, 2),
      mtime: new UTCDate(2102, 2, 22)
    },
    'symlink to existing file 1'
  ),

  'symlink to existing file 1': new Symlink(
    {
      size: 3,
      mode: 77,
      atime: new UTCDate(1420, 10, 5),
      ctime: new UTCDate(2232, 11, 22),
      mtime: new UTCDate(2102, 8, 12)
    },
    'symlink to existing file 2'
  ),

  'symlink to existing file 2': new Symlink(
    {
      size: 3,
      mode: 77,
      atime: new UTCDate(1420, 10, 5),
      ctime: new UTCDate(2232, 11, 22),
      mtime: new UTCDate(2102, 8, 12)
    },
    'simple file'
  ),

  'symlink to existing directory 0': new Symlink(
    {
      size: 3,
      mode: 77,
      atime: new UTCDate(1212, 0, 6),
      ctime: new UTCDate(2121, 1, 2),
      mtime: new UTCDate(2152, 8, 2)
    },
    'symlink to existing directory 1'
  ),

  'symlink to existing directory 1': new Symlink(
    {
      size: 3,
      mode: 77,
      atime: new UTCDate(1242, 6, 6),
      ctime: new UTCDate(5253, 7, 2),
      mtime: new UTCDate(2165, 4, 2)
    },
    'symlink to existing directory 2'
  ),

  'symlink to existing directory 2': new Symlink(
    {
      size: 3,
      mode: 77,
      atime: new UTCDate(1212, 0, 6),
      ctime: new UTCDate(2121, 1, 2),
      mtime: new UTCDate(2152, 8, 2)
    },
    'simple directory'
  ),

  'symlink to non-existing entity 0': new Symlink(
    {
      size: 3,
      mode: 77,
      atime: new UTCDate(1652, 7, 6),
      ctime: new UTCDate(2401, 1, 4),
      mtime: new UTCDate(4820, 6, 6)
    },
    'symlink to non-existing entity 1'
  ),

  'symlink to non-existing entity 1': new Symlink(
    {
      size: 3,
      mode: 77,
      atime: new UTCDate(1870, 4, 0),
      ctime: new UTCDate(2410, 2, 0),
      mtime: new UTCDate(3332, 0, 6)
    },
    'symlink to non-existing entity 2'
  ),

  'symlink to non-existing entity 2': new Symlink(
    {
      size: 3,
      mode: 77,
      atime: new UTCDate(4510, 7, 7),
      ctime: new UTCDate(2987, 4, 1),
      mtime: new UTCDate(8720, 3, 1)
    },
    'entity that does not exist'
  ),

  'simple block device': new BlockDevice({
    size: 5,
    mode: 22,
    atime: new UTCDate(2124, 3, 2),
    ctime: new UTCDate(1242, 3, 4),
    mtime: new UTCDate(5123, 6, 4)
  }),

  'simple character device': new CharacterDevice({
    size: 78,
    mode: 654,
    atime: new UTCDate(2415, 3, 3),
    ctime: new UTCDate(1224, 3, 3),
    mtime: new UTCDate(5201, 6, 5)
  }),

  'simple fifo': new FIFO({
    size: 56,
    mode: 2,
    atime: new UTCDate(2341, 3, 7),
    ctime: new UTCDate(2651, 3, 8),
    mtime: new UTCDate(3542, 6, 0)
  }),

  'simple socket': new Socket({
    size: 54,
    mode: 365,
    atime: new UTCDate(2541, 4, 3),
    ctime: new UTCDate(1520, 8, 15),
    mtime: new UTCDate(5000, 9, 0)
  })
}

export type DictKey = keyof typeof fsPromiseDict
export type EntName = DictKey | 'not exist'
export const DictVal = { ...FakeFileSystem }
export type DictVal = typeof fsPromiseDict extends { [key in DictKey]: infer Val } ? Val : never
export const ItemType = FakeFileSystem.ItemType
export type ItemType = FakeFileSystem.ItemType
export const allDictKeys: ReadonlyArray<DictKey> = Object.keys(fsPromiseDict) as any
export const fsPromise = new FakeFileSystem(fsPromiseDict)
export const getStats = (name: DictKey) => fsPromiseDict[name].statInfo
export const getStatsPattern = (name: DictKey) => expect.objectContaining(getStats(name))
