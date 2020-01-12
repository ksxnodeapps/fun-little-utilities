import { unknownColumn } from 'table-parser-base'

it('same id, same symbol', () => {
  const id = 123
  expect(unknownColumn(id)).toBe(unknownColumn(id))
})

it('different id, different symbol', () => {
  expect(unknownColumn(36)).not.toBe(unknownColumn(12))
})

it('description', () => {
  expect(unknownColumn(32).description).toBe('Unknown Column #32')
})

it('snapshot', () => {
  expect([0, 1, 2, 3, 4, 5].map(unknownColumn)).toMatchSnapshot()
})
