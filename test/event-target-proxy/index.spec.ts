import defaultImport, {
  create,
  EventTargetProxy
} from 'event-target-proxy'

it('exports create function by default', () => {
  expect(defaultImport).toBe(create)
})

describe('create.EvtTrgPrx', () => {
  it('is EventTargetProxy', () => {
    expect(create.EvtTrgPrx).toBe(EventTargetProxy)
  })
})
