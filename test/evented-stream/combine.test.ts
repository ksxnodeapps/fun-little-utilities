import { EventEmitter } from 'events'
import * as assets from 'monorepo-shared-assets'
import { iterateEventedStream, combineEventedStream, EventedStream } from 'evented-stream'
import getAsyncArray = assets.asyncIter.fns.getArray

enum StreamChunk {
  A,
  B,
  C,
  D,
}

class StreamError extends Error {
  constructor() {
    super('Expected')
    this.name = 'StreamError'
  }
}

abstract class MockedEmitter<Chunk extends StreamChunk = StreamChunk> extends EventEmitter
  implements EventedStream<Chunk, StreamError> {
  public emit(event: 'data', chunk: StreamChunk): boolean
  public emit(event: 'error', error: Error): boolean
  public emit(event: 'close'): boolean
  public emit(event: any, ...args: any[]): boolean {
    return super.emit(event, ...args)
  }
}

class FirstEmitter extends MockedEmitter<StreamChunk.A> {}
class SecondEmitter extends MockedEmitter<StreamChunk.B> {}
class ThirdEmitter extends MockedEmitter<StreamChunk.C> {}
class FourthEmitter extends MockedEmitter<StreamChunk.C> {}

type StreamCollection = [FirstEmitter, SecondEmitter, ThirdEmitter, FourthEmitter]

class Init {
  private timeout: number = 0

  private forward(fn: () => void, inc = 10): void {
    this.timeout += inc
    setTimeout(fn, this.timeout)
  }

  public readonly streamCollection: StreamCollection = [
    new FirstEmitter(),
    new SecondEmitter(),
    new ThirdEmitter(),
    new FourthEmitter(),
  ]

  public readonly combination = combineEventedStream<MockedEmitter, StreamChunk, StreamError>(this.streamCollection)

  public readonly emit = {
    data: <Chunk extends StreamChunk>(chunk: Chunk) =>
      this.forward(() => this.streamCollection[chunk].emit('data', chunk)),

    error: <Index extends StreamChunk>(index: Index) =>
      this.forward(() => this.streamCollection[index].emit('error', new StreamError())),

    close: () =>
      this.forward(
        () => this.streamCollection.forEach(stream => stream.emit('close')),
      ),
  }

  public readonly iterate = () => iterateEventedStream(this.combination)
  public readonly getArray = () => getAsyncArray(this.iterate())
  public readonly arrayPromise = this.getArray()
}

expect.addSnapshotSerializer({
  test(value: any): boolean {
    return value instanceof MockedEmitter
  },

  print(value: unknown): string {
    return `${(value as MockedEmitter<any>).constructor.name} {}`
  },
})

describe('when all streams emit data', () => {
  const { arrayPromise, emit, streamCollection } = new Init()
  const order: ReadonlyArray<StreamChunk> = [0, 3, 1, 2, 3, 0, 1, 1, 3, 0, 2, 3, 3, 3]
  order.forEach(emit.data)
  emit.close()

  it('matches snapshot', async () => {
    expect(await arrayPromise).toMatchSnapshot()
  })

  it('data have desired properties', async () => {
    expect(await arrayPromise).toEqual(
      order.map(chunk => ({ stream: streamCollection[chunk], chunk })),
    )
  })

  it('data have desired "stream" properties', async () => {
    ;(await arrayPromise).forEach(
      chunk => expect(chunk.stream).toBe(streamCollection[chunk.chunk]),
    )
  })

  it('data have desired valueOf() values', async () => {
    for (const chunk of await arrayPromise) {
      expect(chunk.valueOf()).toBe(chunk.chunk)
    }
  })
})

describe('when one of the streams emits error', () => {
  const { arrayPromise, emit, streamCollection } = new Init()
  const chosen = StreamChunk.C
  const order: ReadonlyArray<StreamChunk> = [0, 3, 1, 2, 3, 0, 1, 1, 3, 0, 2, 3, 3, 3]
  order.forEach(emit.data)
  emit.error(chosen)

  it('rejects with a reason that matches snapshot', async () => {
    await expect(arrayPromise).rejects.toMatchSnapshot()
  })

  it('rejects with a reason that has desired properties', async () => {
    await expect(arrayPromise).rejects.toMatchObject({
      stream: streamCollection[chosen],
      error: new StreamError(),
    })
  })

  it('rejects with a reason that has desired "stream" properties', async () => {
    const reason = await arrayPromise.then(
      () => {
        throw new Error('Expecting it to rejects but it resolves')
      },
      reason => reason,
    )

    expect(reason.stream).toBe(streamCollection[chosen])
  })

  it('rejects with a reason that has desired "error" properties', async () => {
    const reason = await arrayPromise.then(
      () => Promise.reject(new Error('Expecting it to reject, but it resolves')),
      reason => reason,
    )

    expect(reason.error).toBeInstanceOf(StreamError)
  })
})
