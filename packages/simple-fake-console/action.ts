export enum ActionType {
  Log = 'log',
  Info = 'info',
  Error = 'error',
  Warn = 'warn',
  Clear = 'clear'
}

export namespace ActionType {
  export type WithData =
    ActionType.Log |
    ActionType.Info |
    ActionType.Error |
    ActionType.Warn

  export type WithoutData =
    ActionType.Clear
}

export type ActionData = ReadonlyArray<any>

export type Action =
  Action.WithData |
  Action.WithoutData

export namespace Action {
  export interface Base {
    readonly type: ActionType
  }

  export interface WithData {
    readonly type: ActionType.WithData
    readonly data: ActionData
  }

  export interface WithoutData {
    readonly type: ActionType.WithoutData
  }
}

export type ActionInstance =
  ActionInstance.WithData |
  ActionInstance.WithoutData

export namespace ActionInstance {
  function rename<Class extends Function> (Base: Class): Class {
    // @ts-ignore
    return class ActionInstance extends Base {}
  }

  @rename
  export abstract class Base {}

  @rename
  export class WithData extends Base implements Action.WithData {
    constructor (
      public readonly type: ActionType.WithData,
      public readonly data: ActionData
    ) {
      super()
    }
  }

  @rename
  export class WithoutData extends Base implements Action.WithoutData {
    constructor (
      public readonly type: ActionType.WithoutData
    ) {
      super()
    }
  }
}
