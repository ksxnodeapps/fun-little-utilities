import { SetComplement } from 'utility-types'
import { Main, StatInfo, UnitType, UnknownStatTypeName } from 'catls-lib'

const symType = Symbol()
const symMkFn = Symbol()
const confirm = (): true => true
const deny = (): false => false

class Base {
  private readonly [symType]: StatsInstance.Type

  constructor(type: StatsInstance.Type) {
    this[symType] = type
    return Object.create(this)
  }

  protected [symMkFn](expected: StatsInstance.Type) {
    return expected === this[symType] ? confirm : deny
  }
}

class StatsInfoInstance extends Base implements StatInfo.Stats {
  constructor(
    type: StatsInstance.Type,
    public readonly size: number,
    public readonly mode: number,
    public readonly atime: StatInfo.Stats.Date,
    public readonly ctime: StatInfo.Stats.Date,
    public readonly mtime: StatInfo.Stats.Date,
  ) {
    super(type)
  }
}

export class StatsInstance extends StatsInfoInstance implements Main.Stats {
  public readonly isSymbolicLink = this[symMkFn](Type.Symlink)
  public readonly isFile = this[symMkFn](Type.File)
  public readonly isDirectory = this[symMkFn](Type.Directory)
  public readonly isBlockDevice = this[symMkFn](Type.BlockDevice)
  public readonly isCharacterDevice = this[symMkFn](Type.CharacterDevice)
  public readonly isFIFO = this[symMkFn](Type.FIFO)
  public readonly isSocket = this[symMkFn](Type.Socket)
}

export namespace StatsInstance {
  export interface ConstructorOptions extends StatInfo.Stats {
    readonly type: Type
  }

  export type Type = SetComplement<UnitType, UnitType.Unknown> | UnknownStatTypeName
  export const Type = { ...UnitType, ...UnknownStatTypeName }
}

const { Type } = StatsInstance

export default StatsInstance
