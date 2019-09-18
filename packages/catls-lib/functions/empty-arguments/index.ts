import { EmptyArguments } from '../../types'
import { EmptyArgumentHandlingMethod, ExitStatus } from '../../enums'
const { Quiet, Warn, Error } = EmptyArgumentHandlingMethod
const { Success, InsufficientArguments } = ExitStatus

export function emptyArguments (options: EmptyArguments.Param): EmptyArguments.Return {
  const { method, stream } = options

  switch (method) {
    case Quiet:
      return Success
    case Warn:
      stream.write('[WARN] Should provide at least 1 argument\n')
      return Success
    case Error:
      stream.write('[ERROR] Must provided at least 1 argument\n')
      return InsufficientArguments
  }
}

export default emptyArguments
