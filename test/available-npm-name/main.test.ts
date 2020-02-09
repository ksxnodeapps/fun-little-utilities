import { EventEmitter } from 'events'
import { resolve } from 'url'
import { ConsoleInstance, ActionType, getString } from 'simple-fake-console'
import delay from 'simple-delay'

import {
  Status,
  Process,
  Console,
  Fetch,
  NPM_REGISTRY,
  main
} from 'available-npm-name'

class FakeChunk implements Process.Chunk {
  constructor (
    private readonly text: string
  ) {}
  public toString () {
    return this.text
  }
}

class FakeStream extends EventEmitter implements Process.Stream {
  protected async * prvIterate () {
    yield * [
      '  abc', '\n',
      'de', 'f \n',
      'ghi\n',
      '  jkl\n',
      '@abc', '/def', '\n',
      '', '  \n',
      'mno\n',
      '    \n  ',
      'foo\n',
      'b', 'a', 'r'
    ].map(async (text, index) => {
      await delay(index * 10)
      return new FakeChunk(text)
    })
  }

  public async emitAllData () {
    for await (const chunk of this.prvIterate()) {
      this.emit('data', chunk)
    }
    this.emit('close')
  }
}

class FakeConsole implements Console.Mod {
  public readonly core = new ConsoleInstance()
  public readonly info = jest.fn(this.core.info)

  public getString () {
    return '\n' + getString({
      console: this.core,
      types: [ActionType.Info]
    }) + '\n'
  }
}

const availableNames = [
  'abc',
  'def',
  '@abc/def'
]

const occupiedNames = [
  'ghi',
  'jkl'
]

const erroredNames = [
  'mno',
  'foo',
  'bar'
]

const invalidNames = [
  '!!foo',
  'bar baz'
]

const hasUrl = (names: readonly string[], url: string) => names
  .map(name => resolve(NPM_REGISTRY, encodeURIComponent(name)))
  .includes(url)

const fetchImpl: Fetch.Fn = async url => {
  if (!url.startsWith(NPM_REGISTRY)) {
    throw new Error(`URL are supposed to start with ${NPM_REGISTRY}: ${url}`)
  }

  if (hasUrl(availableNames, url)) return { status: 404 }
  if (hasUrl(occupiedNames, url)) return { status: 200 }
  if (hasUrl(erroredNames, url)) return { status: -1 }

  throw new RangeError(`URL ${url} is unaccounted for`)
}

async function setup (args: readonly string[]) {
  const console = new FakeConsole()
  const fetch = jest.fn(fetchImpl)
  const stdin = new FakeStream()
  void stdin.emitAllData()
  const result = await main({
    argv: {
      _: args,
      registry: NPM_REGISTRY
    },
    process: {
      stdin
    },
    console,
    fetch
  })
  return { console, fetch, stdin, result }
}

describe('names are supplied via cli arguments', () => {
  describe('all names are available', () => {
    const args = [...availableNames]

    it('messages', async () => {
      const { console } = await setup(args)
      expect(console.getString()).toMatchSnapshot()
    })

    it('returns Status.Available', async () => {
      const { result } = await setup(args)
      expect(result).toBe(Status.Available)
    })

    it('calls fetch', async () => {
      const { fetch } = await setup(args)
      expect(fetch.mock.calls).toMatchSnapshot()
    })

    it('calls console.info', async () => {
      const { console } = await setup(args)
      expect(console.info.mock.calls).toMatchSnapshot()
    })

    it('calls console.info', async () => {
      const { console } = await setup(args)
      expect(console.info.mock.calls).toMatchSnapshot()
    })
  })

  describe('all names are occupied', () => {
    const args = [...occupiedNames]

    it('messages', async () => {
      const { console } = await setup(args)
      expect(console.getString()).toMatchSnapshot()
    })

    it('returns Status.Occupied', async () => {
      const { result } = await setup(args)
      expect(result).toBe(Status.Occupied)
    })

    it('calls fetch', async () => {
      const { fetch } = await setup(args)
      expect(fetch.mock.calls).toMatchSnapshot()
    })

    it('calls console.info', async () => {
      const { console } = await setup(args)
      expect(console.info.mock.calls).toMatchSnapshot()
    })

    it('calls console.info', async () => {
      const { console } = await setup(args)
      expect(console.info.mock.calls).toMatchSnapshot()
    })
  })

  describe('all names are causing errors', () => {
    const args = [...erroredNames]

    it('messages', async () => {
      const { console } = await setup(args)
      expect(console.getString()).toMatchSnapshot()
    })

    it('returns Status.NetworkError', async () => {
      const { result } = await setup(args)
      expect(result).toBe(Status.NetworkError)
    })

    it('calls fetch', async () => {
      const { fetch } = await setup(args)
      expect(fetch.mock.calls).toMatchSnapshot()
    })

    it('calls console.info', async () => {
      const { console } = await setup(args)
      expect(console.info.mock.calls).toMatchSnapshot()
    })

    it('calls console.info', async () => {
      const { console } = await setup(args)
      expect(console.info.mock.calls).toMatchSnapshot()
    })
  })

  describe('all names are invalid', () => {
    const args = [...invalidNames]

    it('messages', async () => {
      const { console } = await setup(args)
      expect(console.getString()).toMatchSnapshot()
    })

    it('returns Status.InvalidName', async () => {
      const { result } = await setup(args)
      expect(result).toBe(Status.InvalidName)
    })

    it('calls fetch', async () => {
      const { fetch } = await setup(args)
      expect(fetch.mock.calls).toMatchSnapshot()
    })

    it('calls console.info', async () => {
      const { console } = await setup(args)
      expect(console.info.mock.calls).toMatchSnapshot()
    })

    it('calls console.info', async () => {
      const { console } = await setup(args)
      expect(console.info.mock.calls).toMatchSnapshot()
    })
  })

  describe('all names either available or invalid', () => {
    const args = [...availableNames, ...invalidNames]

    it('messages', async () => {
      const { console } = await setup(args)
      expect(console.getString()).toMatchSnapshot()
    })

    it('returns Status.Available | Status.InvalidName', async () => {
      const { result } = await setup(args)
      expect(result).toBe(Status.Available | Status.InvalidName)
    })

    it('calls fetch', async () => {
      const { fetch } = await setup(args)
      expect(fetch.mock.calls).toMatchSnapshot()
    })

    it('calls console.info', async () => {
      const { console } = await setup(args)
      expect(console.info.mock.calls).toMatchSnapshot()
    })

    it('calls console.info', async () => {
      const { console } = await setup(args)
      expect(console.info.mock.calls).toMatchSnapshot()
    })
  })

  describe('all names either occupied or causing errors', () => {
    const args = [...occupiedNames, ...erroredNames]

    it('messages', async () => {
      const { console } = await setup(args)
      expect(console.getString()).toMatchSnapshot()
    })

    it('returns Status.Occupied | Status.NetworkError', async () => {
      const { result } = await setup(args)
      expect(result).toBe(Status.Occupied | Status.NetworkError)
    })

    it('calls fetch', async () => {
      const { fetch } = await setup(args)
      expect(fetch.mock.calls).toMatchSnapshot()
    })

    it('calls console.info', async () => {
      const { console } = await setup(args)
      expect(console.info.mock.calls).toMatchSnapshot()
    })

    it('calls console.info', async () => {
      const { console } = await setup(args)
      expect(console.info.mock.calls).toMatchSnapshot()
    })
  })

  describe('all status combined', () => {
    const args = [...availableNames, ...occupiedNames, ...erroredNames, ...invalidNames]

    it('messages', async () => {
      const { console } = await setup(args)
      expect(console.getString()).toMatchSnapshot()
    })

    it('returns Status.Available | Status.Occupied | Status.NetworkError | Status.InvalidName', async () => {
      const { result } = await setup(args)
      expect(result).toBe(Status.Available | Status.Occupied | Status.NetworkError | Status.InvalidName)
    })

    it('calls fetch', async () => {
      const { fetch } = await setup(args)
      expect(fetch.mock.calls).toMatchSnapshot()
    })

    it('calls console.info', async () => {
      const { console } = await setup(args)
      expect(console.info.mock.calls).toMatchSnapshot()
    })

    it('calls console.info', async () => {
      const { console } = await setup(args)
      expect(console.info.mock.calls).toMatchSnapshot()
    })
  })
})

describe('names are supplied via stdin', () => {
  const args = [] as const

  describe('combine all status except InvalidName', () => {
    it('messages', async () => {
      const { console } = await setup(args)
      expect(console.getString()).toMatchSnapshot()
    })

    it('returns Status.Available | Status.Occupied | Status.NetworkError', async () => {
      const { result } = await setup(args)
      expect(result).toBe(Status.Available | Status.Occupied | Status.NetworkError)
    })

    it('calls fetch', async () => {
      const { fetch } = await setup(args)
      expect(fetch.mock.calls).toMatchSnapshot()
    })

    it('calls console.info', async () => {
      const { console } = await setup(args)
      expect(console.info.mock.calls).toMatchSnapshot()
    })

    it('calls console.info', async () => {
      const { console } = await setup(args)
      expect(console.info.mock.calls).toMatchSnapshot()
    })
  })
})
