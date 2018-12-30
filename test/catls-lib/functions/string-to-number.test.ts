import { stringToNumber } from 'catls-lib'

const INF_STR = ['inf', 'infinity', '∞', 'all', 'yes', 'true']
const DESC_SFFX = INF_STR.map(x => JSON.stringify(x)).join(', ')

it(`returns Infinity for any of ${DESC_SFFX}`, () => {
  expect(INF_STR.map(stringToNumber)).toEqual(INF_STR.map(() => Infinity))
})

it('returns natural numbers for strings of natural numbers', () => {
  expect(
    ['0', '7', '2', '33', '98'].map(stringToNumber)
  ).toEqual(
    [0, 7, 2, 33, 98]
  )
})

it('returns zeros for strings of negative numbers', () => {
  expect(
    ['-1', '-7', '-8', '-2'].map(stringToNumber)
  ).toEqual(
    [0, 0, 0, 0]
  )
})

it('omits fractional part of a floating-point', () => {
  expect(stringToNumber('12.34')).toEqual(12)
})
