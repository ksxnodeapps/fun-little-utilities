import { snapYaml } from '@tools/test-utils'
import { emptyArguments, EmptyArgumentHandlingMethod, ExitStatus } from 'catls-lib'
import { StreamInstance } from 'simple-fake-stream'
const { Quiet, Warn, Error } = EmptyArgumentHandlingMethod
const { Success, InsufficientArguments } = ExitStatus

function init (method: EmptyArgumentHandlingMethod) {
  const stream = new StreamInstance()
  const status = emptyArguments({ method, stream })
  return { method, stream, status }
}

describe(`when method is ${JSON.stringify(Quiet)}`, () => {
  const { stream, status } = init(Quiet)

  it('does nothing to stream', () => {
    expect(stream.getMethodCalls()).toEqual([])
  })

  it('returns success status', () => {
    expect(status).toBe(Success)
  })
})

describe(`when method is ${JSON.stringify(Warn)}`, () => {
  const { stream, status } = init(Warn)

  it('writes a warning to stream', () => {
    snapYaml(stream.getMethodCalls())
  })

  it('returns success status', () => {
    expect(status).toBe(Success)
  })
})

describe(`when method is ${JSON.stringify(Error)}`, () => {
  const { stream, status } = init(Error)

  it('writes an error message to stream', () => {
    snapYaml(stream.getMethodCalls())
  })

  it(`returns status of ${JSON.stringify(ExitStatus[InsufficientArguments])}`, () => {
    expect(status).toBe(InsufficientArguments)
  })
})
