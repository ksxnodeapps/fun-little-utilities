// tslint:disable:no-unnecessary-qualifier

/**
 * Each type corresponds with a console method
 */
export enum ActionType {
  Log = 'log',
  Info = 'info',
  Error = 'error',
  Warn = 'warn',
  Clear = 'clear'
}

export namespace ActionType {
  /**
   * Corresponding method takes arguments and adds them to database along with the type
   */
  export type WithData =
    ActionType.Log |
    ActionType.Info |
    ActionType.Error |
    ActionType.Warn

  /**
   * Corresponding method takes no arguments
   */
  export type WithoutData =
    ActionType.Clear
}

/**
 * Arguments passed to console methods
 */
export type ActionData = ReadonlyArray<any>

/**
 * Each call in fake console add an `Action` to database
 */
export type Action =
  Action.WithData |
  Action.WithoutData

export namespace Action {
  export interface Base {
    readonly type: ActionType
  }

  /**
   * Subtype of `Action` created by calling console methods that take arguments
   */
  export interface WithData {
    /**
     * Type of action
     */
    readonly type: ActionType.WithData

    /**
     * Arguments passed to console methods
     */
    readonly data: ActionData
  }

  /**
   * Subtype of `Action` created by calling console methods that do not take argument
   */
  export interface WithoutData {
    /**
     * Type of action
     */
    readonly type: ActionType.WithoutData
  }
}

/**
 * Instance of type `Action`
 */
export type ActionInstance =
  ActionInstance.WithData |
  ActionInstance.WithoutData

export namespace ActionInstance {
  function rename<Class extends Function> (Base: Class): Class {
    // @ts-ignore
    return class ActionInstance extends Base {}
  }

  /**
   * Base class of all `ActionInstance` classes
   */
  @rename
  export abstract class Base {}

  /**
   * Instance of type `Action.WithData`
   */
  @rename
  export class WithData extends Base implements Action.WithData {
    constructor (
      /**
       * Type of action
       */
      public readonly type: ActionType.WithData,

      /**
       * Arguments passed to console methods
       */
      public readonly data: ActionData
    ) {
      super()
    }
  }

  /**
   * Instance of type `Action.WithoutData`
   */
  @rename
  export class WithoutData extends Base implements Action.WithoutData {
    constructor (
      /**
       * Type of action
       */
      public readonly type: ActionType.WithoutData
    ) {
      super()
    }
  }
}
