import { Action, ActionType, ActionInstance } from './action'

export interface LogFunc {
  (...args: any[]): void
}

export interface Console {
  readonly log: LogFunc
  readonly info: LogFunc
  readonly error: LogFunc
  readonly warn: LogFunc
}

export interface ConsoleDatabase {
  getActions (): ReadonlyArray<Action>
}

export class ConsoleInstance implements Console, ConsoleDatabase {
  private readonly actions = Array<ActionInstance>()

  private readonly logfn = (type: ActionType): LogFunc => (...data) => {
    this.actions.push(new ActionInstance(type, data))
  }

  public readonly getActions = (): ReadonlyArray<Action> => this.actions

  public readonly log = this.logfn(ActionType.Log)
  public readonly info = this.logfn(ActionType.Info)
  public readonly error = this.logfn(ActionType.Error)
  public readonly warn = this.logfn(ActionType.Warn)
}
