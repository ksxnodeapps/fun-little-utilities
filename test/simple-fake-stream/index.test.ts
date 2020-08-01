import * as assets from 'monorepo-shared-assets'
import * as evtstr from 'evented-stream'
import * as sfs from 'simple-fake-stream'
import getAsyncArray = assets.asyncIter.fns.getArray

abstract class InitBase {
  public readonly stream = new sfs.StreamInstance<string>()

  constructor() {
    this.init(this.stream)
  }

  protected abstract init(stream: InitBase['stream']): void
}

it('MethodName matches snapshot', () => {
  expect(sfs.MethodName).toMatchSnapshot()
})

describe('without method calls', () => {
  class Init extends InitBase {
    protected init() {
      return undefined
    }
  }

  it('StreamDatabase::getMethodCalls() is empty', () => {
    expect(new Init().stream.getMethodCalls()).toEqual([])
  })

  it('StreamDatabase::getChunks() is empty', () => {
    expect(new Init().stream.getChunks()).toEqual([])
  })
})

describe('when WritableStream::write is called', () => {
  class Init extends InitBase {
    protected init(stream: Init['stream']): void {
      stream.write('foo')
      stream.write('bar')
      stream.write('baz')
    }
  }

  it('StreamDatabase::getMethodCalls() matches snapshot', () => {
    expect(new Init().stream.getMethodCalls()).toMatchSnapshot()
  })

  it('StreamDatabase::getChunks() gives expected result', () => {
    expect(new Init().stream.getChunks()).toEqual(['foo', 'bar', 'baz'])
  })

  it('stream is iterable', async () => {
    const { stream } = new Init()
    expect(await getAsyncArray(stream)).toEqual(stream.getChunks())
  })

  it('getString() gives expected result', () => {
    expect(sfs.getString(new Init().stream)).toBe('foobarbaz')
  })

  it('works well with iterate-evented-stream', async () => {
    const { stream } = new Init()
    const iterator = evtstr.iterate(stream)
    void stream.asyncEmit('close')
    const array = await getAsyncArray(iterator)
    expect(array).toEqual(stream.getChunks())
  })
})

describe('when EventedReadableStream::{addListener,removeListener,on,once} is called', () => {
  class FnSetByMethod {
    public addListener(): void {
      return undefined
    }
    public removeListener(): void {
      return undefined
    }
    public on(): void {
      return undefined
    }
    public once(): void {
      return undefined
    }
  }

  class FnSetByEvent {
    public readonly data = new FnSetByMethod()
    public readonly error = new FnSetByMethod()
    public readonly close = new FnSetByMethod()
  }

  const listeners = new FnSetByEvent()

  class Init extends InitBase {
    protected init(stream: Init['stream']): void {
      stream.addListener('data', listeners.data.addListener)
      stream.removeListener('data', listeners.data.removeListener)
      stream.on('data', listeners.data.on)
      stream.once('data', listeners.data.once)

      stream.addListener('error', listeners.error.addListener)
      stream.removeListener('error', listeners.error.removeListener)
      stream.on('error', listeners.error.on)
      stream.once('error', listeners.error.once)

      stream.addListener('close', listeners.close.addListener)
      stream.removeListener('close', listeners.close.removeListener)
      stream.on('close', listeners.close.on)
      stream.once('close', listeners.close.once)
    }
  }

  it('StreamDatabase::getMethodCalls() gives expected result', () => {
    const { addListener, removeListener, on, once } = sfs.MethodName
    const { Data, Error, Close } = sfs.MethodCallInstance.EventModifier

    expect(new Init().stream.getMethodCalls()).toEqual([
      new Data(addListener, listeners.data.addListener),
      new Data(removeListener, listeners.data.removeListener),
      new Data(on, listeners.data.on),
      new Data(once, listeners.data.once),

      new Error(addListener, listeners.error.addListener),
      new Error(removeListener, listeners.error.removeListener),
      new Error(on, listeners.error.on),
      new Error(once, listeners.error.once),

      new Close(addListener, listeners.close.addListener),
      new Close(removeListener, listeners.close.removeListener),
      new Close(on, listeners.close.on),
      new Close(once, listeners.close.once),
    ])
  })
})
