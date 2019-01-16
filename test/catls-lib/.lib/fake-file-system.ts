import { Omit } from 'utility-types'
import { Main, UnitType, StatInfo, UnknownStatTypeName } from 'catls-lib'
import FakeStats from './fake-stats'

const symDict = Symbol('symDict')
const symMkStats = Symbol('symMkFakeStats')
const symAssertExist = Symbol('symAssertExist')
const symFollowSymlink = Symbol('symFollowSymlink')

class ENOENT extends Error {
  public readonly code = 'ENOENT'

  constructor (cmd: string, name: string) {
    super(`ENOENT: No such file or directory: ${cmd} '${name}'`)
  }
}

class FileSystemInstanceBase {
  protected readonly [symDict]: FileSystemInstance.Dict

  constructor (dict: FileSystemInstance.Dict) {
    this[symDict] = dict
  }

  protected [symMkStats] (type: FakeStats.Type, statInfo: StatInfo.Stats): FakeStats {
    return new FakeStats(
      type,
      statInfo.size,
      statInfo.mode,
      statInfo.atime,
      statInfo.ctime,
      statInfo.mtime
    )
  }

  protected [symAssertExist] (
    name: string,
    cmd: string,
    culprit = name
  ): void {
    if (name in this[symDict]) return
    throw new ENOENT(cmd, culprit)
  }

  protected [symFollowSymlink] <Return> (
    cmd: string,
    fn: (param: {
      readonly name: string
      readonly item: FileSystemInstance.Item
    }) => Return
  ): (
    (name: string) => Return
  ) {
    const dict = this[symDict]

    const main = (
      name: string,
      original = name,
      visited: ReadonlyArray<string> = []
    ): Return => {
      this[symAssertExist](name, cmd, original)

      if (visited.includes(name)) {
        throw new ENOENT(cmd, original)
      }

      const item = dict[name]
      return item.type === UnitType.Symlink
        ? main(item.content, original, [...visited, name])
        : fn({ name, item })
    }

    return name => main(name)
  }
}

class FileSystemInstance extends FileSystemInstanceBase implements Main.FileSystemFunctions {
  public readonly stat = this[symFollowSymlink](
    'stat',
    ({ item }) => this[symMkStats](item.type, item.statInfo)
  )

  public readonly lstat = (name: string) => {
    this[symAssertExist](name, 'lstat')
    const item = this[symDict][name]
    return this[symMkStats](item.type, item.statInfo)
  }

  public readonly readlink = (name: string) => {
    this[symAssertExist](name, 'readlink')
    const item = this[symDict][name]

    if (item.type !== UnitType.Symlink) {
      throw new Error(`EINVAL: invalid argument, readlink '${name}'`)
    }

    return item.content
  }

  public readonly realpath = this[symFollowSymlink](
    'realpath',
    param => param.name
  )
}

namespace FileSystemInstance {
  export type Dict = {
    readonly [name: string]: Item
  }

  export type ItemType = FakeStats.Type
  export const ItemType = FakeStats.Type

  const itemClassWithoutContent =
    <Type extends ItemType> (type: Type): (
      new (statInfo: StatInfo.Stats) => ItemBase<Type>
    ) =>
      class ItemInstance extends ItemBase<Type> {
        constructor (statInfo: StatInfo.Stats) {
          super(type, statInfo)
        }
      }

  const itemClassWithContent =
    <Type extends ItemType> (type: Type): (
      new <Content> (statInfo: StatInfo.Stats, content: Content) =>
        ItemBase<Type> & { readonly content: Content }
    ) => class ItemInstance<Content> extends itemClassWithoutContent(type) {
      constructor (
        statInfo: StatInfo.Stats,
        public readonly content: Content
      ) {
        super(statInfo)
      }
    }

  const fileItemClass = (): (
    new (
      statInfo: Omit<StatInfo.Stats, 'size'>,
      content: string
    ) => ItemBase<UnitType.File> & { readonly content: string }
  ) => class File extends itemClassWithContent(ItemType.File)<string> {
    constructor (
      statInfo: Omit<StatInfo.Stats, 'size'>,
      content: string
    ) {
      const size = content.length
      super({ ...statInfo, size }, content)
    }
  }

  const unknownItemClass =
    <Type extends UnknownStatTypeName> (type: Type):
      new (statInfo: StatInfo.Stats) => ItemBase<UnknownStatTypeName> =>
        class Unknown extends itemClassWithoutContent(type) {}

  export type Item =
    Exception |
    Symlink |
    File |
    Directory |
    BlockDevice |
    CharacterDevice |
    FIFO |
    Socket

  export abstract class ItemBase<Type extends ItemType> {
    constructor (
      public readonly type: Type,
      public readonly statInfo: StatInfo.Stats
    ) {}
  }

  export class Exception extends itemClassWithoutContent(ItemType.Exception) {}
  export class Symlink extends itemClassWithContent(ItemType.Symlink)<string> {}
  export class File extends fileItemClass() {}
  export class Directory extends itemClassWithContent(ItemType.Directory)<ReadonlyArray<string>> {}
  export class BlockDevice extends unknownItemClass(ItemType.BlockDevice) {}
  export class CharacterDevice extends unknownItemClass(ItemType.CharacterDevice) {}
  export class FIFO extends unknownItemClass(ItemType.FIFO) {}
  export class Socket extends unknownItemClass(ItemType.Socket) {}
}

export = FileSystemInstance
