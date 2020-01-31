import { partition } from '@tsfun/array'
import { FakePath, symCwd, symRoot } from 'fake-path'

class Path extends FakePath {
  public readonly [symCwd] = '/working/directory'
  public readonly [symRoot] = ['/', '\\', 'C:\\', 'D:\\']
  public readonly sep = '/'
}

it('isAbsolute', () => {
  const { isAbsolute } = new Path()
  const [absolute, relative] = partition([
    '/',
    'C:\\',
    '/a/b/c',
    'C:\\a\\b',
    '.',
    '..',
    'a/b/c',
    './a/b',
    '../a/b'
  ], isAbsolute)
  expect({ absolute, relative }).toMatchSnapshot()
})

describe('join', () => {
  it('relative only', () => {
    const { join } = new Path()
    expect(join('a/b', 'c/d/e', 'f', '.', 'g', '', 'h')).toBe('a/b/c/d/e/f/g/h')
  })

  it('with ".." somewhere', () => {
    const { join } = new Path()
    expect(join('a', 'b/../c', 'd/./e/f', '../g', 'h/i/..', 'j', '../.', './k', './..'))
      .toBe('a/c/d/e/g/h')
  })

  it('first argument is ""', () => {
    const { join } = new Path()
    expect(join('', 'a', 'b', 'c')).toBe('a/b/c')
  })

  it('first argument is "."', () => {
    const { join } = new Path()
    expect(join('.', 'a', 'b', 'c')).toBe('a/b/c')
  })

  it('first argument is ".."', () => {
    const { join } = new Path()
    expect(join('..', 'a', 'b', 'c')).toBe('../a/b/c')
  })

  it('first argument starts with "./"', () => {
    const { join } = new Path()
    expect(join('./a/b', 'c')).toBe('a/b/c')
  })

  it('first argument starts with "../"', () => {
    const { join } = new Path()
    expect(join('../a/b', 'c')).toBe('../a/b/c')
  })

  it('second argument is ""', () => {
    const { join } = new Path()
    expect(join('a/b/c', '')).toBe('a/b/c')
  })

  it('second argument is "."', () => {
    const { join } = new Path()
    expect(join('a/b/c', '.')).toBe('a/b/c')
  })

  it('second argument is ".."', () => {
    const { join } = new Path()
    expect(join('a/b/c', '..')).toBe('a/b')
  })

  it('second argument ends with "/"', () => {
    const { join } = new Path()
    expect(join('a/b', 'c/')).toBe('a/b/c')
  })

  it('second argument ends with "/."', () => {
    const { join } = new Path()
    expect(join('a/b', 'c/.')).toBe('a/b/c')
  })

  it('second argument starts with "../"', () => {
    const { join } = new Path()
    expect(join('a/b', '../c')).toBe('a/c')
  })

  it('second argument ends with "/.."', () => {
    const { join } = new Path()
    expect(join('a/b', 'c/..')).toBe('a/b')
  })
})

describe('resolve', () => {
  it('relative path only', () => {
    const { resolve } = new Path()
    expect(resolve('a', 'b/c', 'd/e/f')).toBe('/working/directory/a/b/c/d/e/f')
  })

  it('with one absolute path', () => {
    const { resolve } = new Path()
    expect(resolve('a/b', 'c', '/d/e/f')).toBe('/d/e/f')
  })
})
