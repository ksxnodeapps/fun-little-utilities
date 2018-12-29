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
  getActions (): ReadonlyArray<Action>
}

/**
 * A fake console
 */
export class ConsoleInstance implements Console, ConsoleDatabase {
  private readonly actions = Array<ActionInstance>()

  private readonly fnWithData = (type: ActionType.WithData): FnWithData => (...data) => {
    this.actions.push(new ActionInstance.WithData(type, data))
  }

  private readonly fnWithoutData = (type: ActionType.WithoutData): FnWithoutData => () => {
    this.actions.push(new ActionInstance.WithoutData(type))
  }

  /**
   * Get all recorded actions
   * @returns Recorded actions
   */
  public readonly getActions = (): ReadonlyArray<Action> => this.actions

  public readonly log = this.fnWithData(ActionType.Log)
  public readonly info = this.fnWithData(ActionType.Info)
  public readonly error = this.fnWithData(ActionType.Error)
  public readonly warn = this.fnWithData(ActionType.Warn)
  public readonly clear = this.fnWithoutData(ActionType.Clear)
}
