import { EventedStream } from 'evented-stream-types'
import Base from './error-base'

export class ErrorCarrier<
  Stream extends EventedStream<Chunk, Error>,
  Error = any,
  Chunk = any,
> extends Base {
  public readonly error: Error
  public readonly stream: Stream

  constructor(error: Error, stream: Stream) {
    super(String(error))
    this.error = error
    this.stream = stream
  }

  protected getName(): string {
    return 'ErrorCarrier'
  }
}

export default ErrorCarrier
