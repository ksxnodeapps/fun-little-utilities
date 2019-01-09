import { Omit } from 'utility-types'
import { Main, UnitType, StatInfo } from 'catls-lib'
import FakeStats from './fake-stats'

const symDict = Symbol('symDict')
const symStatInfo = Symbol('symStatInfo')
const symMkStats = Symbol('symMkFakeStats')

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
}

class FileSystemInstance extends FileSystemInstanceBase implements Main.FileSystemFunctions {
  public readonly existsSync = (name: string) => {
    const item = this[symDict][name]
    if (!item) return false
    if (item.type === UnitType.NonExist) return false
    return true
  }

  public readonly stat = (name: string): FakeStats => {
    if (!this.existsSync(name)) {
      throw new Error(`ENOENT: No such file or directory, stat '${name}'`)
    }

    const item = this[symDict][name]

    return item.type === UnitType.Symlink
      ? this.stat(item.content)
      : this[symMkStats](item.type, item.statInfo)
  }

  public readonly lstat = (name: string) => {
    const item = this[symDict][name]
    return this[symMkStats](item.type, item.statInfo)
  }

  public readonly readlink = (name: string) => {
    const item = this[symDict][name]

    if (item.type !== UnitType.Symlink) {
      throw new Error(`EINVAL: invalid argument, readlink '${name}'`)
    }

    return item.content
  }

  public readonly realpath = (name: string): string => {
    const item = this[symDict][name]
    return item.type === UnitType.Symlink
      ? this.realpath(item.content)
      : name
  }
}

namespace FileSystemInstance {
  export type Dict = {
    readonly [name: string]: Item
  }

  export type ItemType = UnitType
  export const ItemType = UnitType

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
    ) => ItemBase<UnitType.File>
  ) => class File extends itemClassWithContent(ItemType.File)<string> {
    constructor (
      statInfo: Omit<StatInfo.Stats, 'size'>,
      content: string
    ) {
      const size = content.length
      super({ ...statInfo, size }, content)
    }
  }

  export type Item =
    NonExist |
    Symlink |
    File |
    Directory |
    Unknown

  export abstract class ItemBase<Type extends ItemType> {
    constructor (
      public readonly type: Type,
      public readonly statInfo: StatInfo.Stats
    ) {}
  }

  export class NonExist extends itemClassWithoutContent(ItemType.NonExist) {}
  export class Symlink extends itemClassWithContent(ItemType.Symlink)<string> {}
  export class File extends fileItemClass() {}
  export class Directory extends itemClassWithContent(ItemType.Directory)<ReadonlyArray<string>> {}
  export class Unknown extends itemClassWithoutContent(ItemType.Unknown) {}
}

export = FileSystemInstance
