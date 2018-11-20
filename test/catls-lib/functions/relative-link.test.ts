import { relativeLink } from 'catls-lib'
import mockPath from '../.lib/mock-path'

function expectExpression<X> (expression: () => X) {
  const { restore } = mockPath()
  const received = expression()
  restore()

  return {
    toEqual: (expected: X) => expect(received).toEqual(expected)
  }
}

it('works with unix absolute path', () => {
  expectExpression(() => [
    relativeLink('a/b/c', '/'),
    relativeLink('a/b/c', '/foo'),
    relativeLink('a/b/c', '/foo/bar')
  ]).toEqual([
    '/',
    '/foo',
    '/foo/bar'
  ])
})

it('works with windows absolute path', () => {
  expectExpression(() => [
    relativeLink('a\\b\\c', 'C:'),
    relativeLink('a\\b\\c', 'C:\\'),
    relativeLink('a\\b\\c', 'C:\\foo'),
    relativeLink('a\\b\\c', 'C:\\foo\\bar')
  ]).toEqual([
    'C:',
    'C:\\',
    'C:\\foo',
    'C:\\foo\\bar'
  ])
})
