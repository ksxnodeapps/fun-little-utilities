import { Action, ActionType, ActionInstance } from './action'

/**
 * Console method that takes arguments
 */
export interface FnWithData {
  (...args: any[]): void
}

/**
 * Console method that takes no arguments
 */
export interface FnWithoutData {
  (): void
}

/**
 * Interface of a console
 */
export interface Console {
  readonly log: FnWithData
  readonly info: FnWithData
  readonly error: FnWithData
  readonly warn: FnWithData
  readonly clear: FnWithoutData
}

/**
 * Interface of a console data getter
 */
export interface ConsoleDatabase {
  /**
   * Get actions from database
   * @returns Array of `Action` objects
   */
  getActions(): ReadonlyArray<Action>
}

const symActions = Symbol('symActions')
const symFnWithData = Symbol('symFnWithData')
const symFnWithoutData = Symbol('symFnWithoutData')

/**
 * A fake console
 */
export class ConsoleInstance implements Console, ConsoleDatabase {
  private readonly [symActions] = Array<ActionInstance>()

  private readonly [symFnWithData] = (type: ActionType.WithData): FnWithData =>
    (...data) => {
      this[symActions].push(new ActionInstance.WithData(type, data))
    }

  private readonly [symFnWithoutData] = (type: ActionType.WithoutData): FnWithoutData =>
    () => {
      this[symActions].push(new ActionInstance.WithoutData(type))
    }

  /**
   * Get all recorded actions
   * @returns Recorded actions
   */
  public readonly getActions = (): ReadonlyArray<Action> => this[symActions]

  public readonly log = this[symFnWithData](ActionType.Log)
  public readonly info = this[symFnWithData](ActionType.Info)
  public readonly error = this[symFnWithData](ActionType.Error)
  public readonly warn = this[symFnWithData](ActionType.Warn)
  public readonly clear = this[symFnWithoutData](ActionType.Clear)
}
