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

describe('dirname', () => {
  it('no trailing separators: "a/b/c"', () => {
    const { dirname } = new Path()
    expect(dirname('a/b/c')).toBe('a/b')
  })

  it('starts with trailing separator: "/a/b/c"', () => {
    const { dirname } = new Path()
    expect(dirname('/a/b/c')).toBe('/a/b')
  })

  it('ends with trailing separator: "a/b/c/"', () => {
    const { dirname } = new Path()
    expect(dirname('a/b/c/')).toBe('a/b')
  })

  it('starts and ends with trailing separators: "/a/b/c/"', () => {
    const { dirname } = new Path()
    expect(dirname('/a/b/c/')).toBe('/a/b')
  })

  it('empty string: ""', () => {
    const { dirname } = new Path()
    expect(dirname('')).toBe('')
  })

  it('just a dot: "."', () => {
    const { dirname } = new Path()
    expect(dirname('.')).toBe('.')
  })

  it('root: "/"', () => {
    const { dirname } = new Path()
    expect(dirname('/')).toBe('/')
  })

  it('only one segment without trailing separators: "abc"', () => {
    const { dirname } = new Path()
    expect(dirname('abc')).toBe('.')
  })

  it('only one segment and trailing separator suffix: "abc/"', () => {
    const { dirname } = new Path()
    expect(dirname('abc/')).toBe('.')
  })

  it('only one segment and trailing separator prefix: "/abc"', () => {
    const { dirname } = new Path()
    expect(dirname('/abc')).toBe('/')
  })

  it('only one segment and trailing separator suffix and prefix: "/abc/"', () => {
    const { dirname } = new Path()
    expect(dirname('/abc/')).toBe('/')
  })
})

describe('basename', () => {
  it('no trailing separator: "a/b/c"', () => {
    const { basename } = new Path()
    expect(basename('a/b/c')).toBe('c')
  })

  it('starts with trailing separator: "/a/b/c"', () => {
    const { basename } = new Path()
    expect(basename('/a/b/c')).toBe('c')
  })

  it('ends with trailing separator: "a/b/c/"', () => {
    const { basename } = new Path()
    expect(basename('a/b/c/')).toBe('c')
  })

  it('starts and ends with trailing separators: "/a/b/c/"', () => {
    const { basename } = new Path()
    expect(basename('/a/b/c/')).toBe('c')
  })

  it('empty string: ""', () => {
    const { basename } = new Path()
    expect(basename('')).toBe('.')
  })

  it('just a dot: "."', () => {
    const { basename } = new Path()
    expect(basename('.')).toBe('.')
  })

  it('root: "/"', () => {
    const { basename } = new Path()
    expect(basename('/')).toBe('')
  })

  it('only one segment without trailing separators: "abc"', () => {
    const { basename } = new Path()
    expect(basename('abc')).toBe('abc')
  })

  it('only one segment with separator suffix: "abc/"', () => {
    const { basename } = new Path()
    expect(basename('abc/')).toBe('abc')
  })

  it('only one segment with separator prefix: "/abc"', () => {
    const { basename } = new Path()
    expect(basename('/abc')).toBe('abc')
  })

  it('only one segment with separator suffix and prefix: "/abc/"', () => {
    const { basename } = new Path()
    expect(basename('/abc/')).toBe('abc')
  })
})

describe('normalize', () => {
  it('weird path', () => {
    const { normalize } = new Path()
    expect(normalize('a/b/c/../d/e/f/g/../../i/./j//k')).toBe('a/b/d/e/i/j/k')
  })

  it('normal path', () => {
    const { normalize } = new Path()
    expect(normalize('a/b/c/d/e/f')).toBe('a/b/c/d/e/f')
  })

  it('path ends with trailing separator', () => {
    const { normalize } = new Path()
    expect(normalize('a/b/c/d/e/f/')).toBe('a/b/c/d/e/f')
  })

  it('path starts with trailing separator', () => {
    const { normalize } = new Path()
    expect(normalize('/a/b/c/d/e/f')).toBe('/a/b/c/d/e/f')
  })

  it('path starts and ends with trailing separators', () => {
    const { normalize } = new Path()
    expect(normalize('/a/b/c/d/e/f/')).toBe('/a/b/c/d/e/f')
  })

  it('path with empty segments', () => {
    const { normalize } = new Path()
    expect(normalize('a/b//c/./d///e/././f')).toBe('a/b/c/d/e/f')
  })

  it('empty string', () => {
    const { normalize } = new Path()
    expect(normalize('')).toBe('.')
  })

  it('just a dot', () => {
    const { normalize } = new Path()
    expect(normalize('.')).toBe('.')
  })

  it('root', () => {
    const { normalize } = new Path()
    expect(normalize('/')).toBe('/')
  })

  it('edge cases: empty', async () => {
    const { inspect } = await import('util')
    const { normalize } = new Path()
    const result = [
      '',
      './.',
      './/.',
      '././.',
      './',
      './/'
    ]
      .map(weird => ({
        weird: inspect(weird).padStart(10),
        normal: inspect(normalize(weird))
      }))
      .map(item => `${item.weird} => ${item.normal}`)
      .join('\n')
    expect('\n' + result + '\n').toMatchSnapshot()
  })

  it('edge cases: root', async () => {
    const { inspect } = await import('util')
    const { normalize } = new Path()
    const result = [
      '/',
      '//',
      '///',
      '/.',
      '/./.',
      '/.//.',
      '/././.',
      '//./',
      '/.//'
    ]
      .map(weird => ({
        weird: inspect(weird).padStart(10),
        normal: inspect(normalize(weird))
      }))
      .map(item => `${item.weird} => ${item.normal}`)
      .join('\n')
    expect('\n' + result + '\n').toMatchSnapshot()
  })

  it('edge cases: absolute', async () => {
    const { inspect } = await import('util')
    const { normalize } = new Path()
    const result = [
      '/a/b/c',
      '//a//b//c',
      '///a//b/c',
      '/./a/b/c',
      '/././a/./b/c/.',
      '/.//./a/./b/c/',
      '/./././a/./b/c/',
      '//.//a/./b/c/',
      '/.//a/./b/c//'
    ]
      .map(weird => ({
        weird: inspect(weird).padStart(20),
        normal: inspect(normalize(weird))
      }))
      .map(item => `${item.weird} => ${item.normal}`)
      .join('\n')
    expect('\n' + result + '\n').toMatchSnapshot()
  })
})
