import { ConsoleInstance, ActionType, getString } from 'simple-fake-console'
import { MainParam, Format, IndentType, Status, main } from 'parse-markdown-table-cli'
import { getAsyncArray } from './lib/async-array'

const STDIN_TEXT = `
  | id | name        | email                    |
  |----|-------------|--------------------------|
  |  1 | John Doe    | john-doe@gmail.com       |
  |  2 | Peter Smith | petersmith22@outlook.com |
  |  3 | Julia Jones | jjones778@gmail.com      |
`

class InputStream implements AsyncIterable<string> {
  async * [Symbol.asyncIterator] () {
    let length = 0
    let count = length
    let chunk = ''
    for (const char of STDIN_TEXT) {
      if (!count) {
        yield chunk
        chunk = ''
        count = length
        length += 1
      } else {
        count -= 1
      }
      chunk += char
    }
    yield chunk
  }
}

const DICT_OUTPUT = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john-doe@gmail.com'
  },
  {
    id: '2',
    name: 'Peter Smith',
    email: 'petersmith22@outlook.com'
  },
  {
    id: '3',
    name: 'Julia Jones',
    email: 'jjones778@gmail.com'
  }
]

const LIST_OUTPUT = {
  headers: ['id', 'name', 'email'],
  rows: [
    ['1', 'John Doe', 'john-doe@gmail.com'],
    ['2', 'Peter Smith', 'petersmith22@outlook.com'],
    ['3', 'Julia Jones', 'jjones778@gmail.com']
  ]
}

abstract class MockedParam implements MainParam {
  public readonly console = new ConsoleInstance()
  public readonly stdin = new InputStream()
  public abstract readonly format: Format
  public abstract readonly indentType: IndentType
  public abstract readonly indentSize: number
}

async function setup (Param: new () => MockedParam) {
  const param = new Param()
  const status = await main(param)
  return { param, status }
}

describe('assertions', () => {
  it('InputParam yields multiple chunks', async () => {
    expect(await getAsyncArray(new InputStream())).toMatchSnapshot()
  })

  it('InputStream when combine is STDIN_TEXT', async () => {
    const array = await getAsyncArray(new InputStream())
    expect(array.join('')).toBe(STDIN_TEXT)
  })
})

describe('--format=dict --indentType=space --indentSize=2', () => {
  class Param extends MockedParam {
    public readonly format = Format.Dict
    public readonly indentType = IndentType.Space
    public readonly indentSize = 2
  }

  it('calls console.info', async () => {
    const { param } = await setup(Param)
    expect(param.console.getActions()).toMatchSnapshot()
  })

  it('prints expected JSON text', async () => {
    const { param } = await setup(Param)
    const text = getString({
      console: param.console,
      types: [ActionType.Info]
    })
    const object = JSON.parse(text)
    expect(object).toEqual(DICT_OUTPUT)
  })

  it('prints formatted JSON text', async () => {
    const { param } = await setup(Param)
    expect(getString({
      console: param.console,
      types: [ActionType.Info]
    })).toBe(JSON.stringify(DICT_OUTPUT, undefined, 2))
  })

  it('returns 0', async () => {
    const { status } = await setup(Param)
    expect(status).toBe(Status.Success)
  })
})

describe('--format=dict --indentType=tab', () => {
  class Param extends MockedParam {
    public readonly format = Format.Dict
    public readonly indentType = IndentType.Tab
    public readonly indentSize = NaN
  }

  it('calls console.info', async () => {
    const { param } = await setup(Param)
    expect(param.console.getActions()).toMatchSnapshot()
  })

  it('prints expected JSON text', async () => {
    const { param } = await setup(Param)
    const text = getString({
      console: param.console,
      types: [ActionType.Info]
    })
    const object = JSON.parse(text)
    expect(object).toEqual(DICT_OUTPUT)
  })

  it('prints formatted JSON text', async () => {
    const { param } = await setup(Param)
    expect(getString({
      console: param.console,
      types: [ActionType.Info]
    })).toBe(JSON.stringify(DICT_OUTPUT, undefined, '\t'))
  })

  it('returns 0', async () => {
    const { status } = await setup(Param)
    expect(status).toBe(Status.Success)
  })
})

describe('--format=dict --indentType=none', () => {
  class Param extends MockedParam {
    public readonly format = Format.Dict
    public readonly indentType = IndentType.None
    public readonly indentSize = NaN
  }

  it('calls console.info', async () => {
    const { param } = await setup(Param)
    expect(param.console.getActions()).toMatchSnapshot()
  })

  it('prints expected JSON text', async () => {
    const { param } = await setup(Param)
    const text = getString({
      console: param.console,
      types: [ActionType.Info]
    })
    const object = JSON.parse(text)
    expect(object).toEqual(DICT_OUTPUT)
  })

  it('prints minified JSON text', async () => {
    const { param } = await setup(Param)
    expect(getString({
      console: param.console,
      types: [ActionType.Info]
    })).toBe(JSON.stringify(DICT_OUTPUT))
  })

  it('returns 0', async () => {
    const { status } = await setup(Param)
    expect(status).toBe(Status.Success)
  })
})

describe('--format=list --indentType=space --indentSize=2', () => {
  class Param extends MockedParam {
    public readonly format = Format.List
    public readonly indentType = IndentType.Space
    public readonly indentSize = 2
  }

  it('calls console.info', async () => {
    const { param } = await setup(Param)
    expect(param.console.getActions()).toMatchSnapshot()
  })

  it('prints expected JSON text', async () => {
    const { param } = await setup(Param)
    const text = getString({
      console: param.console,
      types: [ActionType.Info]
    })
    const object = JSON.parse(text)
    expect(object).toEqual(LIST_OUTPUT)
  })

  it('prints formatted JSON text', async () => {
    const { param } = await setup(Param)
    expect(getString({
      console: param.console,
      types: [ActionType.Info]
    })).toBe(JSON.stringify(LIST_OUTPUT, undefined, 2))
  })

  it('returns 0', async () => {
    const { status } = await setup(Param)
    expect(status).toBe(Status.Success)
  })
})
