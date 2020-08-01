import { createCommandArguments } from 'mkcmdargv'

describe('specs', () => {
  describe('args', () => {
    it('args without leading dash should stay as-is', () => {
      expect(createCommandArguments({
        args: ['abc', 'def', 'ghi'],
      })).toEqual(['abc', 'def', 'ghi'])
    })

    it('args that have leading dash should be placed after double dash', () => {
      expect(createCommandArguments({
        args: ['abc', '-def', '--ghi', 'jkl'],
      })).toEqual(['abc', 'jkl', '--', '-def', '--ghi'])
    })

    describe('all non-leading-dash args after double dash arg should be placed after two double dashes', () => {
      it('without other leading dash args', () => {
        expect(createCommandArguments({
          args: ['abc', 'def', '--', 'ghi', 'jkl', '--', 'mno'],
        })).toEqual(['abc', 'def', '--', '--', 'ghi', 'jkl', '--', 'mno'])
      })

      it('all args after double dash args should be placed after leading-dash args after double dash', () => {
        expect(createCommandArguments({
          args: ['abc', '-def', '--', 'ghi'],
        })).toEqual(['abc', '--', '-def', '--', 'ghi'])
      })
    })
  })

  describe('flags', () => {
    it('all short flags should be joined together', () => {
      expect(createCommandArguments({
        flags: ['a', 'b', 'c'],
      })).toEqual(['-abc'])
    })

    it('all long flags should not be joined together', () => {
      expect(createCommandArguments({
        flags: ['abc', 'def', 'ghi'],
      })).toEqual(['--abc', '--def', '--ghi'])
    })
  })

  describe('options', () => {
    const param = {
      options: {
        a: false,
        foo: false,
        b: true,
        bar: true,
        e: '',
        empty: '',
        s: 'abc',
        nonEmpty: 'abc',
        0: 0,
        zero: 0,
        n: 12,
        nonZero: 12,
      },
    }

    const get = () => createCommandArguments(param)

    describe('boolean', () => {
      it('false booleans should not appear', () => {
        expect(get()).not.toEqual(expect.arrayContaining(['-a', '--foo']))
      })

      it('true booleans should appear without value', () => {
        expect(get()).toEqual(expect.arrayContaining(['-b', '--bar']))
      })
    })

    it('string should appear regardless of its value', () => {
      expect(get()).toEqual(
        expect.arrayContaining(['-e', '', '--empty=', '-s', 'abc', '--nonEmpty=abc']),
      )
    })

    it('number should appear regardless of its value', () => {
      expect(get()).toEqual(
        expect.arrayContaining(['-0', '0', '--zero=0', '-n', '12', '--nonZero=12']),
      )
    })
  })
})

describe('snapshots', () => {
  it('empty param', () => {
    expect(createCommandArguments({})).toEqual([])
  })

  it('before dash arguments', () => {
    expect(createCommandArguments({
      args: ['abc', 'def', 'ghi'],
    })).toMatchSnapshot()
  })

  it('after dash arguments', () => {
    expect(createCommandArguments({
      args: ['-abc', '--def'],
    })).toMatchSnapshot()
  })

  it('one double dash', () => {
    expect(createCommandArguments({
      args: ['--'],
    })).toMatchSnapshot()
  })

  it('multiple double dashes', () => {
    expect(createCommandArguments({
      args: ['--', 'zzz', '--', 'sss', '--'],
    })).toMatchSnapshot()
  })

  it('before dash arguments and after dash arguments and double dashes', () => {
    expect(createCommandArguments({
      args: ['abc', 'def', '-ghi', '--jkl', '--', 'sss', '--'],
    })).toMatchSnapshot()
  })

  it('single flags', () => {
    expect(createCommandArguments({
      flags: ['p', 'q', 'r'],
    })).toMatchSnapshot()
  })

  it('double flags', () => {
    expect(createCommandArguments({
      flags: ['foo', 'bar', 'baz'],
    })).toEqual(['--foo', '--bar', '--baz'])
  })

  it('single flags and double flags', () => {
    expect(createCommandArguments({
      flags: ['p', 'foo', 'q', 'bar', 'r', 'baz'],
    })).toMatchSnapshot()
  })

  it('single options', () => {
    expect(createCommandArguments({
      options: { a: true, b: false, c: 'foo', d: 123 },
    })).toMatchSnapshot()
  })

  it('double options', () => {
    expect(createCommandArguments({
      options: { abc: true, def: false, ghi: 'bar', jkl: 456 },
    })).toMatchSnapshot()
  })

  it('single options and double options', () => {
    expect(createCommandArguments({
      options: { a: true, abc: true, b: false, def: false, c: 'foo', ghi: 'bar', d: 123, jkl: 456 },
    })).toMatchSnapshot()
  })

  it('all together', () => {
    expect(createCommandArguments({
      args: ['abc', 'def', '-ghi', '--jkl', '--', 'sss', '--'],
      flags: ['p', 'foo', 'q', 'bar', 'r', 'baz'],
      options: { a: true, abc: true, b: false, def: false, c: 'foo', ghi: 'bar', d: 123, jkl: 456 },
    })).toMatchSnapshot()
  })
})
