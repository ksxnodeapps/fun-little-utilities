import { Stats } from 'fs-extra'
import { UnitType } from '../enums'

export namespace Unit {
  export interface Options {
    readonly name: string,
    readonly followSymlink?: number
    readonly getStat: Options.StatFunc
    readonly getLink: Options.LinkReader
    readonly handle: Options.Handler
  }

  export namespace Options {
    export type StatFunc = (name: string) => Stats | Promise<Stats>

    export type LinkReader = (link: string) => string | Promise<string>

    export type Handler = (param: Handler.Param) => void | Promise<void>

    export namespace Handler {
      export type Param =
        Param.NonExist |
        Param.Symlink |
        Param.File |
        Param.Directory |
        Param.Unknown

      export namespace Param {
        export interface Base {
          readonly type: UnitType
          readonly options: Options
        }

        export interface NonExist extends Base {
          readonly type: UnitType.NonExist
        }

        export interface Exist extends Base {
          readonly type: UnitType.Exist
          readonly stats: Stats
        }

        export interface Symlink extends Exist {
          readonly type: UnitType.Symlink
          readonly content: string
          readonly target: string
        }

        export interface File extends Exist {
          readonly type: UnitType.File
        }

        export interface Directory extends Exist {
          readonly type: UnitType.Directory
        }

        export interface Unknown extends Exist {
          readonly type: UnitType.Unknown
        }
      }
    }
  }
}
