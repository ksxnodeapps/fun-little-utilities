import { executor, Executor, ChildProcess } from 'catls-lib'
import doNothing from '../.lib/do-nothing'

function mkspawn () {
  let params: ExecParams

  const spawn: Executor = (name, args): ChildProcess => {
    params = { name, args }

    const eventTarget = {
      addListener: doNothing,
      removeListener: doNothing,
      once: doNothing
    }

    return {
      ...eventTarget,
      stderr: eventTarget,
      stdout: eventTarget
    }
  }

  const getParams = () => params

  return { spawn, getParams }
}

class Init {
  public readonly executeParams: Promise<ExecParams> = this.initExecuteParams()
  public readonly spawnParams: Promise<ExecParams>

  constructor (dontFakeInteractive: boolean) {
    this.spawnParams = this.initSpawnParams(dontFakeInteractive)
  }

  protected async initSpawnParams (dontFakeInteractive: boolean): Promise<ExecParams> {
    const { spawn, getParams } = mkspawn()
    const { name, args } = await this.executeParams
    const execute = executor({ spawn, dontFakeInteractive })
    await execute(name, args)
    return getParams()
  }

  protected async initExecuteParams (): Promise<ExecParams> {
    return { name: 'cmd', args: ['foo', 'bar'] }
  }
}

interface ExecParams {
  readonly name: string
  readonly args: ReadonlyArray<string>
}

describe('when dontFakeInteractive is false', () => {
  const dontFakeInteractive = false

  it('spawns script command', async () => {
    const { spawnParams, executeParams } = new Init(dontFakeInteractive)
    const { name, args } = await executeParams
    expect(await spawnParams).toEqual({
      name: 'script',
      args: [
        '--quiet',
        '--append',
        '/dev/null',
        '--command',
        [name, ...args].join(' ')
      ]
    })
  })
})

describe('when dontFakeInteractive is true', () => {
  const dontFakeInteractive = true

  it('calls spawn as-is', async () => {
    const { spawnParams, executeParams } = new Init(dontFakeInteractive)
    expect(await spawnParams).toEqual(await executeParams)
  })
})
