import { done, undone } from 'construct-iterator'

it('done', () => {
  expect(done).toEqual({ done: true })
})

it('undone', () => {
  const value = 'value'
  expect(undone(value)).toEqual({ done: false, value })
})
