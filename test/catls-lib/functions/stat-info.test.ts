import * as xjest from 'extra-jest'
import { statInfo, StatInfo } from 'catls-lib'
import UTCDate from '../.lib/utc-date'

const STATS: StatInfo.Stats = {
  atime: new UTCDate(1999, 2, 3, 1, 2, 3, 789),
  ctime: new UTCDate(2005, 3, 4, 2, 6, 4, 222),
  mtime: new UTCDate(1234, 5, 6, 7, 8, 9, 354),
  mode: 12,
  size: 34
}

const TYPE = '<Insert Type Here>'

describe('when body argument is not provided', () => {
  it('uses [] as body argument', () => {
    expect(statInfo(TYPE, STATS)).toEqual(statInfo(TYPE, STATS, []))
  })
})

it('matches snapshot', xjest.snap.default(
  statInfo(
    TYPE,
    STATS,
    [
      ['body.foo', 'body.bar'],
      ['body.baz', 'body.qux']
    ]
  ))
)
