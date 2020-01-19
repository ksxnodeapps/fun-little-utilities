import { OutputDescriptor } from './types'

export enum Status {
  FileParsingFailure = 5,
  FileReadingFailure = 4,
  FileWritingFailure = 3,
  OutputFileConflict = 2,
  FatalError = 1,
  Success = 0
}

export namespace Status {
  // tslint:disable-next-line:no-unnecessary-qualifier
  export type Failure = Exclude<Status, Status.Success>
}

export abstract class ResultBase {
  public abstract readonly code: Status

  public get name () {
    return Status[this.code]
  }
}

export class Success<Value> extends ResultBase {
  public readonly code = Status.Success
  public readonly error = undefined
  constructor (public readonly value: Value) {
    super()
  }
}

export abstract class Failure<Error> extends ResultBase {
  public abstract readonly code: Status.Failure
  public readonly value = undefined
  constructor (public readonly error: Error) {
    super()
  }
}

export class OutputFileConflict extends Failure<OutputFileConflict.Error> {
  public readonly code = Status.OutputFileConflict
}

export namespace OutputFileConflict {
  export interface Error extends Map<string, readonly OutputDescriptor[]> {}
}

export class FileWritingFailure extends Failure<readonly any[]> {
  public readonly code = Status.FileWritingFailure
}

export class FileReadingFailure extends Failure<unknown> {
  public readonly code = Status.FileReadingFailure
}

export class FileParsingFailure<Error> extends Failure<Error> {
  public readonly code = Status.FileParsingFailure
}
