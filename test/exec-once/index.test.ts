import once from 'exec-once'

function init<Return>(times: number, impl?: () => Return) {
  const fn = jest.fn(impl)
  const exec = once(fn)
  const results = []
  while (times) {
    ;--times
    results.push(exec())
  }
  return { fn, exec, results }
}

describe('when returning function is never called', () => {
  it('does not call provided function', () => {
    const { fn } = init(0)
    expect(fn).not.toBeCalled()
  })
})

describe('when returning function is called once', () => {
  const value = Symbol('value')
  const get = () => init(1, () => value)

  it('calls provided function once', () => {
    const { fn } = get()
    expect(fn).toBeCalledTimes(1)
  })

  it('returns expected result', () => {
    const { results } = get()
    expect(results).toEqual([value])
  })
})

describe('when returning function is called multiple times', () => {
  const times = 5
  const value = Symbol('value')
  const get = () => init(times, () => value)

  it('calls provided function once', () => {
    const { fn } = get()
    expect(fn).toBeCalledTimes(1)
  })

  it('returns expected result', () => {
    const { results } = get()
    expect(results).toEqual(Array(5).fill(value))
  })
})
