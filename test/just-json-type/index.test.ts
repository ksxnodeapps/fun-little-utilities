import { load, dump } from 'just-json-type'

it('load is JSON.parse', () => {
  expect(load).toBe(JSON.parse)
})

it('dump is JSON.stringify', () => {
  expect(dump).toBe(JSON.stringify)
})
