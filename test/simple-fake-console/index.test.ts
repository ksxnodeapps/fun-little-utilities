import { snapYaml } from '@tools/test-utils'
import * as sfc from 'simple-fake-console'

abstract class InitBase {
  public readonly console = new sfc.ConsoleInstance()

  constructor() {
    this.init(this.console)
  }

  protected abstract init(console: sfc.ConsoleInstance): void
}

it('ActionType matches snapshot', () => {
  expect(sfc.ActionType).toMatchSnapshot()
})

describe('before executing console methods', () => {
  class Init extends InitBase {
    protected init() {
      return undefined
    }
  }

  it('ConsoleDatabase::getActions() is empty', () => {
    const { console } = new Init()
    expect(console.getActions()).toEqual([])
  })

  it('getString() matches snapshot', () => {
    const { console } = new Init()

    snapYaml({
      'log + info': sfc.getString({
        console,
        types: [sfc.ActionType.Log, sfc.ActionType.Info],
      }),
      'error + warn': sfc.getString({
        console,
        types: [sfc.ActionType.Error, sfc.ActionType.Warn],
      }),
    })
  })
})

describe('after executing methods', () => {
  class Init extends InitBase {
    protected init(console: sfc.ConsoleInstance): void {
      console.log('a', 0)
      console.info('b', 1, 2)
      console.error('c', 3, 4, 5)
      console.warn('d', 7, 8, 9, 10)
      console.clear()
      console.log('foo', 'bar')
      console.info('baz')
      console.error('hello', 'world')
      console.warn(123, 456)
      console.clear()
    }
  }

  it('ConsoleDatabase::getActions() matches snapshot', () => {
    const { console } = new Init()
    expect(console.getActions()).toMatchSnapshot()
  })

  it('getString() matches snapshot', () => {
    const { console } = new Init()

    snapYaml({
      'log + info': sfc.getString({
        console,
        types: [sfc.ActionType.Log, sfc.ActionType.Info],
      }),
      'error + warn': sfc.getString({
        console,
        types: [sfc.ActionType.Error, sfc.ActionType.Warn],
      }),
    })
  })
})
