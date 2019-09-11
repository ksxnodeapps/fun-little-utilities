import { main } from 'pretty-exec'

function setup (argv: readonly string[]) {
  const status = 123
  const history = Array<any>()
  const spawn = jest.fn(() => {
    history.push('spawn')
    return { status } as const
  })
  const print = jest.fn(() => {
    history.push('print')
  })
  const error = jest.fn(() => {
    history.push('error')
  })
  const result = main({
    process: { argv } as const,
    spawn,
    print,
    error
  })
  return { status, history, spawn, print, error, argv, result }
}

describe('when argv is sufficient', () => {
  const argv = ['node', 'script', 'command', 'abc', 'def'] as const

  it('calls spawn once', () => {
    const { spawn } = setup(argv)
    expect(spawn).toBeCalledTimes(1)
  })

  it('calls spawn with expected arguments', () => {
    const { spawn } = setup(argv)
    const [command, ...rest] = argv.slice(2)
    expect(spawn).toBeCalledWith(command, rest, { stdio: 'inherit' })
  })

  it('calls print once', () => {
    const { print } = setup(argv)
    expect(print).toBeCalledTimes(1)
  })

  it('calls print with expected arguments', () => {
    const { print } = setup(argv)
    expect(print.mock.calls).toMatchSnapshot()
  })

  it('does not call error', () => {
    const { error } = setup(argv)
    expect(error).not.toBeCalled()
  })

  it('returns status code', () => {
    const { status, result } = setup(argv)
    expect(result).toBe(status)
  })

  it('calls print before spawn', () => {
    const { history } = setup(argv)
    expect(history).toEqual(['print', 'spawn'])
  })
})

describe('when argv is insufficient', () => {
  const argv = ['node', 'script']

  it('does not call spawn', () => {
    const { spawn } = setup(argv)
    expect(spawn).not.toBeCalled()
  })

  it('does not call print', () => {
    const { spawn } = setup(argv)
    expect(spawn).not.toBeCalled()
  })

  it('calls error once', () => {
    const { error } = setup(argv)
    expect(error).toBeCalledTimes(1)
  })

  it('calls error with a message', () => {
    const { error } = setup(argv)
    expect(error).toBeCalledWith('[ERROR] Command is missing')
  })

  it('returns -1', () => {
    const { result } = setup(argv)
    expect(result).toBe(-1)
  })
})

describe('when argv is just enough', () => {
  const argv = ['node', 'script', 'command'] as const

  it('calls spawn once', () => {
    const { spawn } = setup(argv)
    expect(spawn).toBeCalledTimes(1)
  })

  it('calls spawn with expected arguments', () => {
    const { spawn } = setup(argv)
    const [command, ...rest] = argv.slice(2)
    expect(spawn).toBeCalledWith(command, rest, { stdio: 'inherit' })
  })

  it('calls print once', () => {
    const { print } = setup(argv)
    expect(print).toBeCalledTimes(1)
  })

  it('calls print with expected arguments', () => {
    const { print } = setup(argv)
    expect(print.mock.calls).toMatchSnapshot()
  })

  it('does not call error', () => {
    const { error } = setup(argv)
    expect(error).not.toBeCalled()
  })

  it('returns status code', () => {
    const { status, result } = setup(argv)
    expect(result).toBe(status)
  })

  it('calls print before spawn', () => {
    const { history } = setup(argv)
    expect(history).toEqual(['print', 'spawn'])
  })
})
