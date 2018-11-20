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

it('works with absolute path', () => {
  expectExpression(() => [
    relativeLink('a/b/link', '/'),
    relativeLink('a/b/link', '/foo'),
    relativeLink('a/b/link', '/foo/bar')
  ]).toEqual([
    '/',
    '/foo',
    '/foo/bar'
  ])
})

it('works with inward relative path', () => {
  expectExpression(() => [
    relativeLink('a/b/link', ''),
    relativeLink('a/b/link', 'foo'),
    relativeLink('a/b/link', 'foo/bar')
  ]).toEqual([
    'a/b',
    'a/b/foo',
    'a/b/foo/bar'
  ])
})

it('works with outward relative path', () => {
  expectExpression(() => [
    relativeLink('a/b/link', '.'),
    relativeLink('a/b/link', './foo'),
    relativeLink('a/b/link', '..'),
    relativeLink('a/b/link', '../foo'),
    relativeLink('a/b/link', '../..'),
    relativeLink('a/b/link', '../../foo'),
    relativeLink('a/b/link', '../../..'),
    relativeLink('a/b/link', '../../../foo'),
    relativeLink('a/b/link', '../../../..'),
    relativeLink('a/b/link', '../../../../foo')
  ]).toEqual([
    'a/b',
    'a/b/foo',
    'a',
    'a/foo',
    '.',
    'foo',
    '..',
    '../foo',
    '../..',
    '../../foo'
  ])
})
