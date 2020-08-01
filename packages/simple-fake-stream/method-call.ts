// tslint:disable:no-unnecessary-qualifier

import { EventedStream } from 'evented-stream-types'
import { AnyClass } from './utils'

export enum MethodName {
  addListener = 'addListener',
  removeListener = 'removeListener',
  on = 'on',
  once = 'once',
  write = 'write',
}

export namespace MethodName {
  export type EventModifier =
    | MethodName.addListener
    | MethodName.removeListener
    | MethodName.on
    | MethodName.once
}

export type MethodCall<Chunk, Err> =
  | MethodCall.EventModifier<Chunk, Err>
  | MethodCall.Write<Chunk>

export namespace MethodCall {
  export interface Base {
    readonly name: MethodName
  }

  export type EventModifier<Chunk, Err> =
    | EventModifier.Data<Chunk>
    | EventModifier.Error<Err>
    | EventModifier.Close

  export namespace EventModifier {
    export interface Base extends MethodCall.Base {
      readonly name: MethodName.EventModifier
      readonly event: string
      readonly listener: Function
    }

    export interface Data<Chunk> extends Base {
      readonly event: 'data'
      readonly listener: EventedStream.DataEventListener<Chunk>
    }

    export interface Error<Err> extends Base {
      readonly event: 'error'
      readonly listener: EventedStream.ErrorEventListener<Err>
    }

    export interface Close extends Base {
      readonly event: 'close'
      readonly listener: EventedStream.CloseEventListener
    }
  }

  export interface Write<Chunk> extends Base {
    readonly name: MethodName.write
    readonly data: Chunk
  }
}

export type MethodCallInstance<Chunk, Err> =
  | MethodCallInstance.EventModifier<Chunk, Err>
  | MethodCallInstance.Write<Chunk>

export namespace MethodCallInstance {
  function rename<Class extends AnyClass>(Base: Class): Class {
    return class MethodCallInstance extends Base {}
  }

  export abstract class Base<Name extends MethodName = MethodName> implements MethodCall.Base {
    constructor(
      public readonly name: Name,
    ) {}
  }

  export type EventModifier<Chunk, Err> =
    | EventModifier.Data<Chunk>
    | EventModifier.Error<Err>
    | EventModifier.Close

  export namespace EventModifier {
    function bindEvent<Event extends string>(event: Event) {
      return class<Listener extends Function> extends Base<Event, Listener> {
        constructor(name: MethodName.EventModifier, listener: Listener) {
          super(name, event, listener)
        }
      }
    }

    export abstract class Base<Event extends string, Listener extends Function>
      extends MethodCallInstance.Base<MethodName.EventModifier>
      implements MethodCall.EventModifier.Base {
      constructor(
        name: MethodName.EventModifier,
        public readonly event: Event,
        public readonly listener: Listener,
      ) {
        super(name)
      }
    }

    @rename
    export class Data<Chunk> extends bindEvent('data')<EventedStream.DataEventListener<Chunk>>
      implements MethodCall.EventModifier.Data<Chunk> {}

    @rename
    export class Error<Err> extends bindEvent('error')<EventedStream.ErrorEventListener<Err>>
      implements MethodCall.EventModifier.Error<Err> {}

    @rename
    export class Close extends bindEvent('close')<EventedStream.CloseEventListener>
      implements MethodCall.EventModifier.Close {}
  }

  @rename
  export class Write<Chunk> extends Base<MethodName.write> implements MethodCall.Write<Chunk> {
    constructor(
      public readonly data: Chunk,
    ) {
      super(MethodName.write)
    }
  }
}
