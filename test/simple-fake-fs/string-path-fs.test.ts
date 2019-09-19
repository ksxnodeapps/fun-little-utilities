import { StringPathFileSystem, ErrorKind } from 'simple-fake-fs'

function create () {
  return new StringPathFileSystem('/', {
    a: {
      0: 'zero',
      b: {
        1: 'one',
        c: {}
      }
    },
    abc: {
      def: {
        ghi: 'abcdefghi'
      }
    },
    foo: {
      bar: 'foobar',
      baz: 'foobaz'
    }
  })
}

function getError (fn: () => any) {
  let value: any = undefined

  try {
    value = fn()
  } catch (error) {
    return error
  }

  throw new Error(`Expecting function to throws an error, but it returns ${JSON.stringify(value)}`)
}

describe('constructor', () => {
  it('without dict', () => {
    expect(new StringPathFileSystem('/')).toMatchSnapshot()
  })

  it('with dict', () => {
    expect(create()).toMatchSnapshot()
  })
})

describe('existsSync', () => {
  describe('on thing that exists', () => {
    it('""', () => {
      expect(create().existsSync('')).toBe(true)
    })

    it('"."', () => {
      expect(create().existsSync('.')).toBe(true)
    })

    it('"/"', () => {
      expect(create().existsSync('/')).toBe(true)
    })

    it('"./"', () => {
      expect(create().existsSync('./')).toBe(true)
    })

    it('"/."', () => {
      expect(create().existsSync('/.')).toBe(true)
    })

    it('"a"', () => {
      expect(create().existsSync('a')).toBe(true)
    })

    it('"a/b"', () => {
      expect(create().existsSync('a/b')).toBe(true)
    })

    it('"a/b/c"', () => {
      expect(create().existsSync('a/b/c')).toBe(true)
    })

    it('"./a"', () => {
      expect(create().existsSync('./a')).toBe(true)
    })

    it('"./a/b"', () => {
      expect(create().existsSync('./a/b')).toBe(true)
    })

    it('"./a/b/c"', () => {
      expect(create().existsSync('./a/b/c')).toBe(true)
    })

    it('"a/"', () => {
      expect(create().existsSync('a/')).toBe(true)
    })

    it('"a/b/"', () => {
      expect(create().existsSync('a/b/')).toBe(true)
    })

    it('"a/b/c/"', () => {
      expect(create().existsSync('a/b/c/')).toBe(true)
    })

    it('"a/0"', () => {
      expect(create().existsSync('a/0')).toBe(true)
    })

    it('"a/b/1"', () => {
      expect(create().existsSync('a/b/1')).toBe(true)
    })

    it('"abc"', () => {
      expect(create().existsSync('abc')).toBe(true)
    })

    it('"abc/def"', () => {
      expect(create().existsSync('abc/def')).toBe(true)
    })

    it('"abc/def/ghi"', () => {
      expect(create().existsSync('abc/def/ghi')).toBe(true)
    })
  })

  describe('on thing that does not exist', () => {
    it('"Q"', () => {
      expect(create().existsSync('Q')).toBe(false)
    })

    it('"a/Q"', () => {
      expect(create().existsSync('a/Q')).toBe(false)
    })

    it('"a/b/Q"', () => {
      expect(create().existsSync('a/b/Q')).toBe(false)
    })

    it('"a/b/c/Q"', () => {
      expect(create().existsSync('a/b/c/Q')).toBe(false)
    })
  })
})

describe('statSync', () => {
  describe('on file', () => {
    describe('"a/0"', () => {
      it('has isFile() returns true', () => {
        expect(create().statSync('a/0').isFile()).toBe(true)
      })

      it('has isDirectory() returns false', () => {
        expect(create().statSync('a/0').isDirectory()).toBe(false)
      })
    })

    describe('"abc/def/ghi"', () => {
      it('has isFile() returns true', () => {
        expect(create().statSync('abc/def/ghi').isFile()).toBe(true)
      })

      it('has isDirectory() returns false', () => {
        expect(create().statSync('abc/def/ghi').isDirectory()).toBe(false)
      })
    })

    describe('"foo/bar"', () => {
      it('has isFile() returns true', () => {
        expect(create().statSync('foo/bar').isFile()).toBe(true)
      })

      it('has isDirectory() returns false', () => {
        expect(create().statSync('foo/bar').isDirectory()).toBe(false)
      })
    })

    describe('"foo/baz"', () => {
      it('has isFile() returns true', () => {
        expect(create().statSync('foo/baz').isFile()).toBe(true)
      })

      it('has isDirectory() returns false', () => {
        expect(create().statSync('foo/baz').isDirectory()).toBe(false)
      })
    })
  })

  describe('on directory', () => {
    describe('""', () => {
      it('has isFile() returns false', () => {
        expect(create().statSync('').isFile()).toBe(false)
      })

      it('has isDirectory() returns true', () => {
        expect(create().statSync('').isDirectory()).toBe(true)
      })
    })

    describe('"."', () => {
      it('has isFile() returns false', () => {
        expect(create().statSync('.').isFile()).toBe(false)
      })

      it('has isDirectory() returns true', () => {
        expect(create().statSync('.').isDirectory()).toBe(true)
      })
    })

    describe('"a"', () => {
      it('has isFile() returns false', () => {
        expect(create().statSync('a').isFile()).toBe(false)
      })

      it('has isDirectory() returns true', () => {
        expect(create().statSync('a').isDirectory()).toBe(true)
      })
    })

    describe('"a/b"', () => {
      it('has isFile() returns false', () => {
        expect(create().statSync('a/b').isFile()).toBe(false)
      })

      it('has isDirectory() returns true', () => {
        expect(create().statSync('a/b').isDirectory()).toBe(true)
      })
    })

    describe('"a/b/c"', () => {
      it('has isFile() returns false', () => {
        expect(create().statSync('a/b/c').isFile()).toBe(false)
      })

      it('has isDirectory() returns true', () => {
        expect(create().statSync('a/b/c').isDirectory()).toBe(true)
      })
    })

    describe('"abc"', () => {
      it('has isFile() returns false', () => {
        expect(create().statSync('abc').isFile()).toBe(false)
      })

      it('has isDirectory() returns true', () => {
        expect(create().statSync('abc').isDirectory()).toBe(true)
      })
    })
  })

  describe('on thing that does not exist: throws an error', () => {
    describe('"thing/that/does/not/exist"', () => {
      function init () {
        const name = 'thing/that/does/not/exist'
        const fs = create()
        const fn = () => fs.statSync(name)
        return { name, fs, fn }
      }

      it('matches snapshot', () => {
        expect(getError(init().fn)).toMatchSnapshot()
      })

      it('has .errno = ErrorKind.ENOENT', () => {
        expect(getError(init().fn)).toHaveProperty('errno', ErrorKind.ENOENT)
      })

      it('has .code = "ENOENT"', () => {
        expect(getError(init().fn)).toHaveProperty('code', 'ENOENT')
      })

      it('has .syscall = "stat"', () => {
        expect(getError(init().fn)).toHaveProperty('syscall', 'stat')
      })

      it('has .path', () => {
        const { name, fn } = init()
        expect(getError(fn)).toHaveProperty('path', name.split('/'))
      })
    })

    describe('"thing-that-does-not-exist"', () => {
      function init () {
        const name = 'thing-that-does-not-exist'
        const fs = create()
        const fn = () => fs.statSync(name)
        return { name, fs, fn }
      }

      it('matches snapshot', () => {
        expect(getError(init().fn)).toMatchSnapshot()
      })

      it('has .errno = ErrorKind.ENOENT', () => {
        expect(getError(init().fn)).toHaveProperty('errno', ErrorKind.ENOENT)
      })

      it('has .code = "ENOENT"', () => {
        expect(getError(init().fn)).toHaveProperty('code', 'ENOENT')
      })

      it('has .syscall = "stat"', () => {
        expect(getError(init().fn)).toHaveProperty('syscall', 'stat')
      })

      it('has .path', () => {
        const { name, fn } = init()
        expect(getError(fn)).toHaveProperty('path', name.split('/'))
      })
    })
  })
})

describe('readdirSync', () => {
  describe('on directory', () => {
    it('""', () => {
      expect(create().readdirSync('')).toEqual(['a', 'abc', 'foo'])
    })

    it('"a"', () => {
      expect(create().readdirSync('a')).toEqual(['0', 'b'])
    })

    it('"a/b/c"', () => {
      expect(create().readdirSync('a/b/c')).toEqual([])
    })

    it('"abc"', () => {
      expect(create().readdirSync('abc')).toEqual(['def'])
    })

    it('"abc/def"', () => {
      expect(create().readdirSync('abc/def')).toEqual(['ghi'])
    })

    it('"foo"', () => {
      expect(create().readdirSync('foo')).toEqual(['bar', 'baz'])
    })
  })

  describe('on file: throws an error', () => {
    function init () {
      const name = 'abc/def/ghi'
      const fs = create()
      const fn = () => fs.readdirSync(name)
      return { name, fs, fn }
    }

    it('matches snapshot', () => {
      expect(getError(init().fn)).toMatchSnapshot()
    })

    it('has .errno = ErrorKind.ENOTDIR', () => {
      expect(getError(init().fn)).toHaveProperty('errno', ErrorKind.ENOTDIR)
    })

    it('has .code = "ENOTDIR"', () => {
      expect(getError(init().fn)).toHaveProperty('code', 'ENOTDIR')
    })

    it('has .syscall = "scandir"', () => {
      expect(getError(init().fn)).toHaveProperty('syscall', 'scandir')
    })

    it('has .path', () => {
      const { name, fn } = init()
      expect(getError(fn)).toHaveProperty('path', name.split('/'))
    })
  })

  describe('on thing that does not exist: throws an error', () => {
    describe('"thing/that/does/not/exist"', () => {
      function init () {
        const name = 'thing/that/does/not/exist'
        const fs = create()
        const fn = () => fs.readdirSync(name)
        return { name, fs, fn }
      }

      it('matches snapshot', () => {
        expect(getError(init().fn)).toMatchSnapshot()
      })

      it('has .errno = ErrorKind.ENOENT', () => {
        expect(getError(init().fn)).toHaveProperty('errno', ErrorKind.ENOENT)
      })

      it('has .code = "ENOENT"', () => {
        expect(getError(init().fn)).toHaveProperty('code', 'ENOENT')
      })

      it('has .syscall = "scandir"', () => {
        expect(getError(init().fn)).toHaveProperty('syscall', 'scandir')
      })

      it('has .path', () => {
        const { name, fn } = init()
        expect(getError(fn)).toHaveProperty('path', name.split('/'))
      })
    })

    describe('"thing-that-does-not-exist"', () => {
      function init () {
        const name = 'thing-that-does-not-exist'
        const fs = create()
        const fn = () => fs.readdirSync(name)
        return { name, fs, fn }
      }

      it('matches snapshot', () => {
        expect(getError(init().fn)).toMatchSnapshot()
      })

      it('has .errno = ErrorKind.ENOENT', () => {
        expect(getError(init().fn)).toHaveProperty('errno', ErrorKind.ENOENT)
      })

      it('has .code = "ENOENT"', () => {
        expect(getError(init().fn)).toHaveProperty('code', 'ENOENT')
      })

      it('has .syscall = "scandir"', () => {
        expect(getError(init().fn)).toHaveProperty('syscall', 'scandir')
      })

      it('has .path', () => {
        const { name, fn } = init()
        expect(getError(fn)).toHaveProperty('path', name.split('/'))
      })
    })
  })
})

describe('readFileSync', () => {
  describe('on file', () => {
    it('"abc/def/ghi"', () => {
      expect(create().readFileSync('abc/def/ghi')).toBe('abcdefghi')
    })

    it('"foo/bar"', () => {
      expect(create().readFileSync('foo/bar')).toBe('foobar')
    })

    it('"foo/baz"', () => {
      expect(create().readFileSync('foo/baz')).toBe('foobaz')
    })
  })

  describe('on directory: throws an error', () => {
    function init () {
      const name = 'abc/def'
      const fs = create()
      const fn = () => fs.readFileSync(name)
      return { name, fs, fn }
    }

    it('matches snapshot', () => {
      expect(getError(init().fn)).toMatchSnapshot()
    })

    it('has .errno = ErrorKind.EISDIR', () => {
      expect(getError(init().fn)).toHaveProperty('errno', ErrorKind.EISDIR)
    })

    it('has .code = "EISDIR"', () => {
      expect(getError(init().fn)).toHaveProperty('code', 'EISDIR')
    })

    it('has .syscall = "read"', () => {
      expect(getError(init().fn)).toHaveProperty('syscall', 'read')
    })

    it('has .path', () => {
      const { name, fn } = init()
      expect(getError(fn)).toHaveProperty('path', name.split('/'))
    })
  })

  describe('on thing that does not exist: throws an error', () => {
    describe('"thing/that/does/not/exist"', () => {
      function init () {
        const name = 'thing/that/does/not/exist'
        const fs = create()
        const fn = () => fs.readFileSync(name)
        return { name, fs, fn }
      }

      it('matches snapshot', () => {
        expect(getError(init().fn)).toMatchSnapshot()
      })

      it('has .errno = ErrorKind.ENOENT', () => {
        expect(getError(init().fn)).toHaveProperty('errno', ErrorKind.ENOENT)
      })

      it('has .code = "ENOENT"', () => {
        expect(getError(init().fn)).toHaveProperty('code', 'ENOENT')
      })

      it('has .syscall = "read"', () => {
        expect(getError(init().fn)).toHaveProperty('syscall', 'read')
      })

      it('has .path', () => {
        const { name, fn } = init()
        expect(getError(fn)).toHaveProperty('path', name.split('/'))
      })
    })

    describe('"thing-that-does-not-exist""', () => {
      function init () {
        const name = 'thing-that-does-not-exist'
        const fs = create()
        const fn = () => fs.readFileSync(name)
        return { name, fs, fn }
      }

      it('matches snapshot', () => {
        expect(getError(init().fn)).toMatchSnapshot()
      })

      it('has .errno = ErrorKind.ENOENT', () => {
        expect(getError(init().fn)).toHaveProperty('errno', ErrorKind.ENOENT)
      })

      it('has .code = "ENOENT"', () => {
        expect(getError(init().fn)).toHaveProperty('code', 'ENOENT')
      })

      it('has .syscall = "read"', () => {
        expect(getError(init().fn)).toHaveProperty('syscall', 'read')
      })

      it('has .path', () => {
        const { name, fn } = init()
        expect(getError(fn)).toHaveProperty('path', name.split('/'))
      })
    })
  })
})

describe('mkdirSync', () => {
  describe('on name that has yet to be occupied', () => {
    function init (name: string) {
      const fs = create()
      fs.mkdirSync(name)
      return { name, fs }
    }

    describe('"abc/def/new"', () => {
      const name = 'abc/def/new'

      it('existsSync() returns true', () => {
        expect(init(name).fs.existsSync(name)).toBe(true)
      })

      it('statSync().isDirectory() returns true', () => {
        expect(init(name).fs.statSync(name).isDirectory()).toBe(true)
      })

      it('statSync().isFile() returns false', () => {
        expect(init(name).fs.statSync(name).isFile()).toBe(false)
      })

      it('readdirSync() returns an empty array', () => {
        expect(init(name).fs.readdirSync(name)).toEqual([])
      })
    })

    describe('"new"', () => {
      const name = 'new'

      it('existsSync() returns true', () => {
        expect(init(name).fs.existsSync(name)).toBe(true)
      })

      it('statSync().isDirectory() returns true', () => {
        expect(init(name).fs.statSync(name).isDirectory()).toBe(true)
      })

      it('statSync().isFile() returns false', () => {
        expect(init(name).fs.statSync(name).isFile()).toBe(false)
      })

      it('readdirSync() returns an empty array', () => {
        expect(init(name).fs.readdirSync(name)).toEqual([])
      })
    })
  })

  describe('on name that is occupied by a file: throws an error', () => {
    function init () {
      const name = 'abc/def/ghi'
      const fs = create()
      const fn = () => fs.mkdirSync(name)
      return { name, fs, fn }
    }

    it('matches snapshot', () => {
      expect(getError(init().fn)).toMatchSnapshot()
    })

    it('has .errno = ErrorKind.EEXIST', () => {
      expect(getError(init().fn)).toHaveProperty('errno', ErrorKind.EEXIST)
    })

    it('has .code = "EEXIST"', () => {
      expect(getError(init().fn)).toHaveProperty('code', 'EEXIST')
    })

    it('has .syscall = "mkdir"', () => {
      expect(getError(init().fn)).toHaveProperty('syscall', 'mkdir')
    })

    it('has .path', () => {
      const { name, fn } = init()
      expect(getError(fn)).toHaveProperty('path', name.split('/'))
    })
  })

  describe('on name that is occupied by a directory: throws an error', () => {
    function init () {
      const name = 'abc'
      const fs = create()
      const fn = () => fs.mkdirSync(name)
      return { name, fs, fn }
    }

    it('matches snapshot', () => {
      expect(getError(init().fn)).toMatchSnapshot()
    })

    it('has .errno = ErrorKind.EEXIST', () => {
      expect(getError(init().fn)).toHaveProperty('errno', ErrorKind.EEXIST)
    })

    it('has .code = "EEXIST"', () => {
      expect(getError(init().fn)).toHaveProperty('code', 'EEXIST')
    })

    it('has .syscall = "mkdir"', () => {
      expect(getError(init().fn)).toHaveProperty('syscall', 'mkdir')
    })

    it('has .path', () => {
      const { name, fn } = init()
      expect(getError(fn)).toHaveProperty('path', name.split('/'))
    })
  })

  describe('on thing that does not exist: throws an error', () => {
    function init () {
      const name = 'thing/that/does/not/exist'
      const fs = create()
      const fn = () => fs.mkdirSync(name)
      return { name, fs, fn }
    }

    it('matches snapshot', () => {
      expect(getError(init().fn)).toMatchSnapshot()
    })

    it('has .errno = ErrorKind.ENOENT', () => {
      expect(getError(init().fn)).toHaveProperty('errno', ErrorKind.ENOENT)
    })

    it('has .code = "ENOENT"', () => {
      expect(getError(init().fn)).toHaveProperty('code', 'ENOENT')
    })

    it('has .syscall = "mkdir"', () => {
      expect(getError(init().fn)).toHaveProperty('syscall', 'mkdir')
    })

    it('has .path', () => {
      const { name, fn } = init()
      expect(getError(fn)).toHaveProperty('path', name.split('/'))
    })
  })
})
