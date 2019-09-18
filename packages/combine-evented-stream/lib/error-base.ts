export abstract class ErrorBase extends Error {
  public readonly name: string
  protected abstract getName (): string

  constructor (message: string) {
    super(message)
    this.name = this.getName()
  }
}

export default ErrorBase
