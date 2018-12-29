export enum ActionType {
  Log = 'log',
  Info = 'info',
  Error = 'error',
  Warn = 'warn'
}

export type ActionData = ReadonlyArray<any>

export interface Action {
  type: ActionType
  data: ActionData
}

export class ActionInstance implements Action {
  constructor (
    public type: ActionType,
    public data: ActionData
  ) {}
}
