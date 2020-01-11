import { snapYaml } from '@tools/test-utils'
import { showExecData } from 'catls-lib'
import { StreamInstance } from 'simple-fake-stream'
import FakeChildProcess from '../.lib/fake-child-process'

const emitClose = (cp: FakeChildProcess, status: number, timeout: number) =>
  void setTimeout(() => cp.emit('close', status), timeout)

abstract class InitBase {
  public readonly writable = new StreamInstance()
  public readonly expectedCmd = 'command'
  public readonly expectedArgs = ['foo', 'bar', 'baz']
  public readonly childProcess = new FakeChildProcess()

  public receivedCmd?: string
  public receivedArgs?: ReadonlyArray<string>

  public readonly promise = showExecData({
    cmd: this.expectedCmd,
    args: this.expectedArgs,
    writable: this.writable,
    execute: async (cmd, args) => {
      this.receivedCmd = cmd
      this.receivedArgs = args
      await this.processChildProcess(this.childProcess)
      return this.childProcess
    }
  })

  public get receivedStatus () {
    return this.promise
  }

  protected abstract processChildProcess (cp: FakeChildProcess): void | Promise<void>
}

describe('calls ShowExecData.Param::execute', () => {
  class Init extends InitBase {
    protected processChildProcess () {
      return undefined
    }
  }

  it('with expected cmd argument', () => {
    const { receivedCmd, expectedCmd } = new Init()
    expect(receivedCmd).toBe(expectedCmd)
  })

  it('with expected args argument', () => {
    const { receivedArgs, expectedArgs } = new Init()
    expect(receivedArgs).toEqual(expectedArgs)
  })
})

describe('when child process emit "close" event', () => {
  it('returns expected status code', async () => {
    class Init extends InitBase {
      protected processChildProcess (cp: FakeChildProcess) {
        emitClose(cp, expectedStatus, 100)
      }
    }

    const expectedStatus = 123
    const receivedStatus = await new Init().receivedStatus

    expect(receivedStatus).toBe(expectedStatus)
  })
})

it('writes data into ShowExecParam.Param::writable', async () => {
  class Init extends InitBase {
    protected processChildProcess (cp: FakeChildProcess) {
      const { stdout, stderr } = cp

      // data: 'abc\ndef\nghi\njkl'
      stdout.write('abc\n')
      stdout.write('de')
      stdout.write('f\ng')
      stdout.write('hi\njkl')

      stdout.emit('close')
      stderr.emit('close')

      emitClose(cp, 0, 100)
    }
  }

  const { writable, promise } = new Init()
  await promise

  const methodCalls = writable.getMethodCalls()
  const chunks = writable.getChunks()
  const text = chunks.map(x => String(x)).join('')

  snapYaml({
    methodCalls,
    chunks,
    text
  })
})
