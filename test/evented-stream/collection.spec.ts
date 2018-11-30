import * as all from 'evented-stream'

it('module.iterate is module.iterateEventedStream', () => {
  expect(all.iterate).toBe(all.iterateEventedStream)
})

it('module.combine is module.combineEventedStream', () => {
  expect(all.combine).toBe(all.combineEventedStream)
})
