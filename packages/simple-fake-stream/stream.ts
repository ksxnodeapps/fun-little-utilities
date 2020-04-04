import { EventEmitter } from 'events'
import 'monorepo-shared-assets/.polyfill'
import { EventedStream } from 'evented-stream-types'
import { MethodName, MethodCall, MethodCallInstance } from './method-call'

/**
 * Interface of a evented read-only stream
 */
export interface EventedReadableStream<Chunk extends string | Buffer, Err = any>
extends EventedStream<Chunk, Err> {
  readonly on: EventedStream.ListenerModifier<Chunk, Err>
  readonly once: EventedStream.ListenerModifier<Chunk, Err>
}

/**
 * Interface of a iterable read-only stream
 */
export interface IterableReadableStream<Chunk extends string | Buffer> extends AsyncIterable<Chunk> {}

/**
 * Interface of a read-only stream
 */
export interface ReadableStream<Chunk extends string | Buffer, Err = any>
extends EventedReadableStream<Chunk, Err>, IterableReadableStream<Chunk> {}

/**
 * Interface of a write-only stream
 */
export interface WritableStream<Chunk extends string | Buffer> {
  write (chunk: Chunk): void
}

/**
 * Interface of a stream
 */
export interface Stream<Chunk extends string | Buffer, Err = any>
extends ReadableStream<Chunk, Err>, WritableStream<Chunk> {}

/**
 * Interface of an event emitter
 */
export interface StreamEventEmitter<Chunk extends string | Buffer, Err = any> {
  readonly emit: StreamEventEmitter.EmitFunc<void, Chunk, Err>
  readonly asyncEmit: StreamEventEmitter.EmitFunc<Promise<void>, Chunk, Err>
}

export namespace StreamEventEmitter {
  /**
   * Function that emits events
   */
  export interface EmitFunc<Return, Chunk extends string | Buffer, Err = any> {
    (event: 'data', data: Chunk): Return
    (event: 'error', error: Err): Return
    (event: 'close'): Return
  }
}

/**
 * Interface of a stream data getter
 */
export interface StreamDatabase<Chunk extends string | Buffer, Err> {
  /**
   * Get recorded method calls
   * @return Array of recorded method calls
   */
  getMethodCalls (): ReadonlyArray<MethodCall<Chunk, Err>>

  /**
   * Get chunks that has been passed to `.write()`
   * @return Array of recorded chunks
   */
  getChunks (): ReadonlyArray<Chunk>
}

namespace prvEvtEmt {
  interface StreamInstanceBaseClass {
    new <Chunk extends string | Buffer, Err>
      (options?: StreamInstance.ConstructorOptions):
        StreamInstanceBaseClass.Instance<Chunk, Err>
  }

  namespace StreamInstanceBaseClass {
    export interface Instance<Chunk extends string | Buffer, Err = any>
    extends Stream<Chunk, Err>, StreamEventEmitter<Chunk, Err>, StreamDatabase<Chunk, Err> {}
  }

  namespace event2mtdcall {
    export const data = MethodCallInstance.EventModifier.Data
    export const error = MethodCallInstance.EventModifier.Error
    export const close = MethodCallInstance.EventModifier.Close
  }

  function recordListenerModifier<
    Chunk extends string | Buffer,
    Err
  > (
    db: Array<MethodCall<Chunk, Err>>,
    name: MethodName.EventModifier,
    event: 'data' | 'error' | 'close',
    listener: any
  ): void {
    type Constructor = new (name: any, listener: any) => any
    const Instance: Constructor = event2mtdcall[event]
    const instance = new Instance(name, listener)
    db.push(instance)
  }

  /**
   * `StreamInstance` is a subclass of `StreamInstanceBase`
   * which in turn is a wrapper of `EventEmitter`
   */
  export const StreamInstanceBase: StreamInstanceBaseClass =
  class <Chunk extends string | Buffer, Err = any>
  implements Stream<Chunk, Err>, StreamEventEmitter<Chunk, Err>, StreamDatabase<Chunk, Err> {
    readonly #symEvents = new EventEmitter()
    readonly #symMethodCalls = Array<MethodCall<Chunk, Err>>()
    readonly #symDataEventTimeout: number

    constructor (options: StreamInstance.ConstructorOptions = {}) {
      const { dataEventTimeout = 0 } = options
      this.#symDataEventTimeout = dataEventTimeout
    }

    public addListener (event: any, listener: any): void {
      this.#symEvents.addListener(event, listener)
      recordListenerModifier(this.#symMethodCalls, MethodName.addListener, event, listener)
    }

    public removeListener (event: any, listener: any): void {
      this.#symEvents.removeListener(event, listener)
      recordListenerModifier(this.#symMethodCalls, MethodName.removeListener, event, listener)
    }

    public on (event: any, listener: any): void {
      this.#symEvents.on(event, listener)
      recordListenerModifier(this.#symMethodCalls, MethodName.on, event, listener)
    }

    public once (event: any, listener: any): void {
      this.#symEvents.once(event, listener)
      recordListenerModifier(this.#symMethodCalls, MethodName.once, event, listener)
    }

    public write (chunk: Chunk): void {
      this.#symMethodCalls.push(new MethodCallInstance.Write(chunk))
      void this.asyncEmit('data', chunk)
    }

    public emit (...args: [any, ...any[]]): void {
      this.#symEvents.emit(...args)
    }

    public asyncEmit (...args: [any, ...any[]]): Promise<void> {
      return new Promise(resolve => setTimeout(() => {
        this.emit(...args)
        resolve()
      }, this.#symDataEventTimeout))
    }

    public getMethodCalls () {
      return this.#symMethodCalls
    }

    public getChunks () {
      return this.#symMethodCalls
        .filter((x): x is MethodCall.Write<Chunk> => x.name === MethodName.write)
        .map(x => x.data)
    }

    public async * [Symbol.asyncIterator] () {
      yield * this.getChunks()
    }
  }
}

export class StreamInstance<Chunk extends string | Buffer, Err = any>
extends prvEvtEmt.StreamInstanceBase<Chunk, Err>
implements Stream<Chunk, Err>, StreamEventEmitter<Chunk, Err>, StreamDatabase<Chunk, Err> {}

export namespace StreamInstance {
  export interface ConstructorOptions {
    readonly dataEventTimeout?: number
  }
}
