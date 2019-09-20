import { ArrayPathFileSystem, FakeFileContent } from 'simple-fake-fs'
import { DeepParam, traverse } from 'fast-traverse'

const create = () => new ArrayPathFileSystem([
  ['a', []],
  ['b', new FakeFileContent('B')],
  ['c', [
    ['d', new FakeFileContent('A')],
    ['e', [
      ['f', new FakeFileContent('CEF')]
    ]],
    ['g', []]
  ]],
  ['h', [
    ['i', new FakeFileContent('HI')],
    ['j', [
      ['k', new FakeFileContent('HKJ')]
    ]]
  ]]
])

const join = (a: readonly string[], b: string) => a.concat(b)

async function consume<X> (iterable: AsyncIterable<X>) {
  const result = []

  for await (const item of iterable) {
    result.push(item)
  }

  return result
}

describe('default deep', () => {
  async function setup (dirname: readonly string[]) {
    const fs = create()
    const readdir = jest.fn(fs.readdirSync)
    const stat = jest.fn(fs.statSync)
    const results = await consume(traverse({
      dirname,
      join,
      readdir,
      stat
    }))
    return { dirname, fs, readdir, stat, results }
  }

  describe('[]', () => {
    const dirname = [] as const

    it('yields results matching snapshot', async () => {
      const { results } = await setup(dirname)
      expect(results).toMatchSnapshot()
    })

    it('yields expected results', async () => {
      const { results } = await setup(dirname)
      expect(results).not.toEqual(expect.not.arrayContaining([{
        basename: expect.any(String),
        dirname: expect.any(Array),
        list: expect.any(Array),
        level: expect.any(Number)
      }]))
    })

    it('calls readdir multiple times', async () => {
      const { readdir } = await setup(dirname)
      expect(readdir.mock.calls).toMatchSnapshot()
    })

    it('calls stat multiple times', async () => {
      const { stat } = await setup(dirname)
      expect(stat.mock.calls).toMatchSnapshot()
    })
  })

  describe('["c"]', () => {
    const dirname = ['c'] as const

    it('yields results matching snapshot', async () => {
      const { results } = await setup(dirname)
      expect(results).toMatchSnapshot()
    })

    it('yields expected results', async () => {
      const { results } = await setup(dirname)
      expect(results).not.toEqual(expect.not.arrayContaining([{
        basename: expect.any(String),
        dirname: expect.any(Array),
        list: expect.any(Array),
        level: expect.any(Number)
      }]))
    })

    it('calls readdir multiple times', async () => {
      const { readdir } = await setup(dirname)
      expect(readdir.mock.calls).toMatchSnapshot()
    })

    it('calls stat multiple times', async () => {
      const { stat } = await setup(dirname)
      expect(stat.mock.calls).toMatchSnapshot()
    })
  })

  describe('["c", "e"]', () => {
    const dirname = ['c', 'e'] as const

    it('yields results matching snapshot', async () => {
      const { results } = await setup(dirname)
      expect(results).toMatchSnapshot()
    })

    it('yields expected results', async () => {
      const { results } = await setup(dirname)
      expect(results).not.toEqual(expect.not.arrayContaining([{
        basename: undefined,
        dirname: expect.any(Array),
        list: expect.any(Array),
        level: expect.any(Number)
      }]))
    })

    it('calls readdir multiple times', async () => {
      const { readdir } = await setup(dirname)
      expect(readdir.mock.calls).toMatchSnapshot()
    })

    it('calls stat multiple times', async () => {
      const { stat } = await setup(dirname)
      expect(stat.mock.calls).toMatchSnapshot()
    })
  })

  describe('["c", "g"]', () => {
    const dirname = ['c', 'g'] as const

    it('yields results matching snapshot', async () => {
      const { results } = await setup(dirname)
      expect(results).toMatchSnapshot()
    })

    it('yields expected results', async () => {
      const { results } = await setup(dirname)
      expect(results).toEqual(expect.not.arrayContaining([{
        basename: expect.any(String),
        dirname: expect.any(Array),
        list: expect.any(Array),
        level: expect.any(Number)
      }]))
    })

    it('calls readdir multiple times', async () => {
      const { readdir } = await setup(dirname)
      expect(readdir.mock.calls).toMatchSnapshot()
    })

    it('calls stat multiple times', async () => {
      const { stat } = await setup(dirname)
      expect(stat.mock.calls).toMatchSnapshot()
    })
  })
})

describe('deep that always return true', () => {
  async function setup () {
    const dirname = Array<string>()
    const fs = create()
    const deep = jest.fn(() => true as const)
    const readdir = jest.fn(fs.readdirSync)
    const stat = jest.fn(fs.statSync)
    const results = await consume(traverse({
      dirname,
      deep,
      join,
      readdir,
      stat
    }))
    return { dirname, fs, deep, readdir, stat, results }
  }

  it('yields results matching snapshot', async () => {
    const { results } = await setup()
    expect(results).toMatchSnapshot()
  })

  it('yields expected results', async () => {
    const { results } = await setup()
    expect(results).not.toEqual(expect.not.arrayContaining([{
      basename: expect.any(String),
      dirname: expect.any(Array),
      list: expect.any(Array),
      level: expect.any(Number)
    }]))
  })

  it('calls deep multiple times', async () => {
    const { deep } = await setup()
    expect(deep.mock.calls).toMatchSnapshot()
  })

  it('calls deep with expected arguments', async () => {
    const { deep } = await setup()
    expect(deep).not.toBeCalledWith(expect.not.objectContaining({
      basename: expect.any(String),
      path: expect.any(Array),
      level: expect.any(Number),
      container: expect.any(Array)
    }))
  })

  it('calls readdir multiple times', async () => {
    const { readdir } = await setup()
    expect(readdir.mock.calls).toMatchSnapshot()
  })

  it('calls stat multiple times', async () => {
    const { stat } = await setup()
    expect(stat.mock.calls).toMatchSnapshot()
  })
})

describe('deep that returns false when path = ["c", "e"]', () => {
  function deepImpl (c: string, e: string, rest: readonly string[]) {
    return c !== 'c' || e !== 'e' || rest.length !== 0
  }

  async function setup () {
    const dirname = Array<string>()
    const fs = create()
    const deep = jest.fn((param: DeepParam<string[], string[], string>) => {
      const [c, e, ...rest] = param.path
      return deepImpl(c, e, rest)
    })
    const readdir = jest.fn(fs.readdirSync)
    const stat = jest.fn(fs.statSync)
    const results = await consume(traverse({
      dirname,
      deep,
      join,
      readdir,
      stat
    }))
    return { dirname, fs, deep, readdir, stat, results }
  }

  it('assert: deepImpl("c", "e", []) → false', () => {
    expect(deepImpl('c', 'e', [])).toBe(false)
  })

  it('assert: deepImpl(not "c", "e", []) → true', () => {
    expect(deepImpl('C', 'e', [])).toBe(true)
  })

  it('assert: deepImpl("c", not "e", []) → true', () => {
    expect(deepImpl('c', 'E', [])).toBe(true)
  })

  it('assert: deepImpl("c", "e", [any, ...any[]]) → true', () => {
    expect(deepImpl('c', 'e', ['a'])).toBe(true)
  })

  it('yields results matching snapshot', async () => {
    const { results } = await setup()
    expect(results).toMatchSnapshot()
  })

  it('does not yield { dirname: ["c", "e"] }', async () => {
    const { results } = await setup()
    expect(results).not.toContainEqual(expect.objectContaining({
      dirname: ['c', 'e']
    }))
  })
})
