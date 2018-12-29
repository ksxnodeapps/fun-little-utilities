import { Action, ActionType, ActionInstance } from './action'

export interface FnWithData {
  (...args: any[]): void
}

export interface FnWithoutData {
  (): void
}

export interface Console {
  readonly log: FnWithData
  readonly info: FnWithData
  readonly error: FnWithData
  readonly warn: FnWithData
  readonly clear: FnWithoutData
}

export interface ConsoleDatabase {
  getActions (): ReadonlyArray<Action>
}

export class ConsoleInstance implements Console, ConsoleDatabase {
  private readonly actions = Array<ActionInstance>()

  private readonly fnWithData = (type: ActionType.WithData): FnWithData => (...data) => {
    this.actions.push(new ActionInstance.WithData(type, data))
  }

  private readonly fnWithoutData = (type: ActionType.WithoutData): FnWithoutData => () => {
    this.actions.push(new ActionInstance.WithoutData(type))
  }

  public readonly getActions = (): ReadonlyArray<Action> => this.actions

  public readonly log = this.fnWithData(ActionType.Log)
  public readonly info = this.fnWithData(ActionType.Info)
  public readonly error = this.fnWithData(ActionType.Error)
  public readonly warn = this.fnWithData(ActionType.Warn)
  public readonly clear = this.fnWithoutData(ActionType.Clear)
}
