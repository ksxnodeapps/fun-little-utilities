import { createPrettyExec, chalkModule } from 'pretty-exec'

const colorSupportLevel = chalkModule.default.supportsColor.level
beforeEach(() => {
  chalkModule.default.level = chalkModule.Level.Basic
})
afterEach(() => {
  chalkModule.default.level = colorSupportLevel
})

function setup () {
  const value = Symbol('value')
  const history = Array<any>()
  const spawn = jest.fn(() => {
    history.push('spawn')
    return value
  })
  const print = jest.fn(() => {
    history.push('print')
  })
  const prettyExec = createPrettyExec({
    spawn,
    print
  })
  return { value, history, spawn, print, prettyExec }
}

describe('when resulting function is not called', () => {
  it('does not call spawn', () => {
    const { spawn } = setup()
    expect(spawn).not.toBeCalled()
  })

  it('does not call print', () => {
    const { spawn } = setup()
    expect(spawn).not.toBeCalled()
  })
})

describe('when resulting function is called once', () => {
  function setupAndCall () {
    const { prettyExec, ...rest } = setup()
    const args = ['command', 'abc', '-o', 'def', '--flag', '--foo=bar', '--', 'ghi', '--not-flag'] as const
    const result = prettyExec(...args)
    return { args, result, prettyExec, ...rest }
  }

  it('calls spawn once', () => {
    const { spawn } = setupAndCall()
    expect(spawn).toBeCalledTimes(1)
  })

  it('calls spawn with expected arguments', () => {
    const { spawn, args: [command, ...rest] } = setupAndCall()
    expect(spawn).toBeCalledWith(command, rest, { stdio: 'inherit' })
  })

  it('calls print once', () => {
    const { print } = setupAndCall()
    expect(print).toBeCalledTimes(1)
  })

  it('calls print with expected arguments', () => {
    const { print } = setupAndCall()
    expect(print.mock.calls).toMatchSnapshot()
  })

  it('returns result of spawn', () => {
    const { value, result } = setupAndCall()
    expect(result).toBe(value)
  })

  it('calls print before spawn', () => {
    const { history } = setupAndCall()
    expect(history).toEqual(['print', 'spawn'])
  })
})
