import { EventedStream } from './types'

export abstract class RenamableError extends Error {
  public readonly name: string
  protected abstract getName (): string

  constructor (message: string) {
    super(message)
    this.name = this.getName()
  }
}

export abstract class InternalStreamError<Chunk> extends RenamableError {
  public readonly stream: EventedStream<Chunk, any>
  public readonly error: any

  constructor (stream: EventedStream<Chunk, any>, error: any) {
    super(String(error))
    this.stream = stream
    this.error = error
  }
}

export class StdOutError<Chunk> extends InternalStreamError<Chunk> {
  protected getName (): string {
    return 'StdOutError'
  }
}

export class StdErrError<Chunk> extends InternalStreamError<Chunk> {
  protected getName (): string {
    return 'StdErrError'
  }
}
