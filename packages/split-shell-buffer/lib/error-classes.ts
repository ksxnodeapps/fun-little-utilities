import { EventedStream } from './types'

export abstract class RenamableError extends Error {
  public readonly name: string
  protected abstract getName (): string

  constructor (message: string) {
    super(message)
    this.name = this.getName()
  }
}

export abstract class InternalStreamError extends RenamableError {
  public readonly stream: EventedStream
  public readonly error: any

  constructor (stream: EventedStream, error: any) {
    super(String(error))
    this.stream = stream
    this.error = error
  }
}

export class StdOutError extends InternalStreamError {
  protected getName (): string {
    return 'StdOutError'
  }
}

export class StdErrError extends InternalStreamError {
  protected getName (): string {
    return 'StdErrError'
  }
}
