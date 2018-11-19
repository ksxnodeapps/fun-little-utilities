import { relativeLink } from 'catls-lib'
import mkpath from '../.lib/mkpath'

it('works with unix absolute path', () => {
  expect([
    relativeLink('a/b/c', '/'),
    relativeLink('a/b/c', '/foo'),
    relativeLink('a/b/c', '/foo/bar')
  ]).toEqual([
    '/',
    '/foo',
    '/foo/bar'
  ].map(mkpath))
})

it('works with windows absolute path', () => {
  expect([
    relativeLink('a\\b\\c', 'C:'),
    relativeLink('a\\b\\c', 'C:\\'),
    relativeLink('a\\b\\c', 'C:\\foo'),
    relativeLink('a\\b\\c', 'C:\\foo\\bar')
  ]).toEqual([
    'C:',
    'C:',
    'C:\\foo',
    'C:\\foo\\bar'
  ].map(mkpath))
})
