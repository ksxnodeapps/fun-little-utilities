import { ConsoleInstance, ActionType, getString } from 'simple-fake-console'
import { MainParam, RowType, IndentType, main } from 'parse-markdown-table-cli'

const STDIN_TEXT = `
  | id | name        | email                    |
  |----|-------------|--------------------------|
  |  1 | John Doe    | john-doe@gmail.com       |
  |  2 | Peter Smith | petersmith22@outlook.com |
  |  3 | Julia Jones | jjones778@gmail.com      |
`

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
  public readonly getStdIn = jest.fn(async () => STDIN_TEXT)
  public abstract readonly rowType: RowType
  public abstract readonly indentType: IndentType
  public abstract readonly indentSize: number
}

async function setup (Param: new () => MockedParam) {
  const param = new Param()
  const status = await main(param)
  return { param, status }
}

describe('--rowType=dict --indentType=space --indentSize=2', () => {
  class Param extends MockedParam {
    public readonly rowType = RowType.Dict
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
})

describe('--rowType=dict --indentType=tab', () => {
  class Param extends MockedParam {
    public readonly rowType = RowType.Dict
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
})

describe('--rowType=dict --indentType=none', () => {
  class Param extends MockedParam {
    public readonly rowType = RowType.Dict
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
})

describe('--rowType=list --indentType=space --indentSize=2', () => {
  class Param extends MockedParam {
    public readonly rowType = RowType.List
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
})
