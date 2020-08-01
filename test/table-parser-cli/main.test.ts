import { ActionType, ConsoleInstance, getString } from 'simple-fake-console'
import {
  Type,
  IndentType,
  Process,
  MainParam,
  Status,
  main,
  getAsyncArray,
  createObjectTable,
  createArrayTable,
} from 'table-parser-cli'

const getConsoleString = (console: ConsoleInstance) =>
  getString({
    console,
    types: [ActionType.Info],
  })

class Chunks implements AsyncIterable<string> {
  constructor(
    private readonly text: string,
    private readonly length = 4,
  ) {}

  async *[Symbol.asyncIterator]() {
    let count = this.length
    let chunk = ''
    for (const char of this.text) {
      if (!count) {
        yield chunk
        chunk = ''
        count = this.length
      } else {
        count -= 1
      }
      chunk += char
    }
    yield chunk
  }
}

it('assertion: yield chunks', async () => {
  const chunks = new Chunks('abcdefghijklmnopqrstuvwxyz')
  expect(await getAsyncArray(chunks)).toEqual(['abcd', 'efghi', 'jklmn', 'opqrs', 'tuvwx', 'yz'])
})

const DICT = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john-doe@gmail.com',
  },
  {
    id: '2',
    name: 'Peter Smith',
    email: 'petersmith22@outlook.com',
  },
  {
    id: '3',
    name: 'Julia Jones',
    email: 'jjones778@gmail.com',
  },
]

const LIST = {
  headers: ['id', 'name', 'email'],
  rows: [
    ['1', 'John Doe', 'john-doe@gmail.com'],
    ['2', 'Peter Smith', 'petersmith22@outlook.com'],
    ['3', 'Julia Jones', 'jjones778@gmail.com'],
  ],
}

class JsonStream<Object> extends Chunks {
  constructor(public readonly object: Object) {
    super(JSON.stringify(object, undefined, 2))
  }
}

abstract class MockedParam implements MainParam {
  public readonly console = new ConsoleInstance()
  public abstract readonly process: Process
  public abstract readonly type: Type
  public abstract readonly indentType: IndentType
  public abstract readonly indentSize: number
}

async function setup(Param: new () => MockedParam) {
  const param = new Param()
  const status = await main(param)
  return { param, status }
}

describe('--type arr2obj', () => {
  const OBJECT = LIST

  abstract class ParamBase extends MockedParam {
    public readonly type = Type.ArrayToObject
    public readonly process = { stdin: new JsonStream(OBJECT) }
  }

  describe('--indentType space --indentSize 2', () => {
    class Param extends ParamBase {
      public readonly indentType = IndentType.Space
      public readonly indentSize = 2
    }

    it('calls console.info', async () => {
      const { param } = await setup(Param)
      expect(param.console.getActions()).toMatchSnapshot()
    })

    it('prints expected JSON output', async () => {
      const { param } = await setup(Param)
      expect(getConsoleString(param.console)).toBe(JSON.stringify(
        await getAsyncArray(createObjectTable(OBJECT)),
        undefined,
        2,
      ))
    })

    it('returns 0', async () => {
      const { status } = await setup(Param)
      expect(status).toBe(Status.Success)
    })
  })

  describe('--indentType tab', () => {
    class Param extends ParamBase {
      public readonly indentType = IndentType.Tab
      public readonly indentSize = undefined!
    }

    it('calls console.info', async () => {
      const { param } = await setup(Param)
      expect(param.console.getActions()).toMatchSnapshot()
    })

    it('prints expected JSON output', async () => {
      const { param } = await setup(Param)
      expect(getConsoleString(param.console)).toBe(JSON.stringify(
        await getAsyncArray(createObjectTable(OBJECT)),
        undefined,
        '\t',
      ))
    })

    it('returns 0', async () => {
      const { status } = await setup(Param)
      expect(status).toBe(Status.Success)
    })
  })

  describe('--indentType none', () => {
    class Param extends ParamBase {
      public readonly indentType = IndentType.None
      public readonly indentSize = undefined!
    }

    it('calls console.info', async () => {
      const { param } = await setup(Param)
      expect(param.console.getActions()).toMatchSnapshot()
    })

    it('prints expected JSON output', async () => {
      const { param } = await setup(Param)
      expect(getConsoleString(param.console)).toBe(JSON.stringify(
        await getAsyncArray(createObjectTable(OBJECT)),
      ))
    })

    it('returns 0', async () => {
      const { status } = await setup(Param)
      expect(status).toBe(Status.Success)
    })
  })
})

describe('--type obj2arr', () => {
  const OBJECT = DICT

  abstract class ParamBase extends MockedParam {
    public readonly type = Type.ObjectToArray
    public readonly process = { stdin: new JsonStream(OBJECT) }
  }

  async function* iterateObjectTable() {
    yield* OBJECT
  }

  describe('--indentType space --indentSize 2', () => {
    class Param extends ParamBase {
      public readonly indentType = IndentType.Space
      public readonly indentSize = 2
    }

    it('calls console.info', async () => {
      const { param } = await setup(Param)
      expect(param.console.getActions()).toMatchSnapshot()
    })

    it('prints expected JSON output', async () => {
      const { param } = await setup(Param)
      expect(getConsoleString(param.console)).toBe(JSON.stringify(
        await createArrayTable(iterateObjectTable()),
        undefined,
        2,
      ))
    })

    it('returns 0', async () => {
      const { status } = await setup(Param)
      expect(status).toBe(Status.Success)
    })
  })

  describe('--indentType tab', () => {
    class Param extends ParamBase {
      public readonly indentType = IndentType.Tab
      public readonly indentSize = undefined!
    }

    it('calls console.info', async () => {
      const { param } = await setup(Param)
      expect(param.console.getActions()).toMatchSnapshot()
    })

    it('prints expected JSON output', async () => {
      const { param } = await setup(Param)
      expect(getConsoleString(param.console)).toBe(JSON.stringify(
        await createArrayTable(iterateObjectTable()),
        undefined,
        '\t',
      ))
    })

    it('returns 0', async () => {
      const { status } = await setup(Param)
      expect(status).toBe(Status.Success)
    })
  })

  describe('--indentType none', () => {
    class Param extends ParamBase {
      public readonly indentType = IndentType.None
      public readonly indentSize = undefined!
    }

    it('calls console.info', async () => {
      const { param } = await setup(Param)
      expect(param.console.getActions()).toMatchSnapshot()
    })

    it('prints expected JSON output', async () => {
      const { param } = await setup(Param)
      expect(getConsoleString(param.console)).toBe(JSON.stringify(
        await createArrayTable(iterateObjectTable()),
      ))
    })

    it('returns 0', async () => {
      const { status } = await setup(Param)
      expect(status).toBe(Status.Success)
    })
  })
})
