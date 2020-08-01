async function setup() {
  const spy = jest.spyOn(globalThis, 'setTimeout')
  const { simpleDelay } = await import('simple-delay')
  const delay = 5
  const result = await simpleDelay(delay)
  return { spy, delay, result }
}

afterEach(() => jest.restoreAllMocks())

it('calls setTimeout once', async () => {
  const { spy } = await setup()
  expect(spy).toBeCalledTimes(1)
})

it('calls setTimeout with expected arguments', async () => {
  const { spy, delay } = await setup()
  expect(spy).toBeCalledWith(expect.any(Function), delay)
})

it('resolves undefined', async () => {
  const { result } = await setup()
  expect(result).toBe(undefined)
})

it('exports simpleDelay as default', async () => {
  const { default: defaultExport, simpleDelay } = await import('simple-delay')
  expect(defaultExport).toBe(simpleDelay)
})
