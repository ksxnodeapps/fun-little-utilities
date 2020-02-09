export const enum Status {
  InvalidName = 0b0100,
  NetworkError = 0b0010,
  Occupied = 0b0001,
  Available = 0b0000
}

export interface CliArguments {
  readonly _: readonly string[]
  readonly registry: string
}

export namespace Fetch {
  export interface Fn {
    (url: string): Promise<Response>
  }

  export interface Response {
    readonly status: number
  }
}

export namespace Console {
  export interface Mod {
    readonly info: Log
  }

  export interface Log {
    (message: string): void
  }
}

export namespace Process {
  export interface Mod {
    readonly stdin: Stream
  }

  export type Stream = Event.Target<'data', Chunk> & Event.Target<'close', void>

  export interface Chunk {
    toString (): string
  }
}

export namespace Event {
  export interface Target<Type, Info> {
    addListener (type: Type, listener: Listener<Info>): void
    removeListener (type: Type, listener: any): void
  }

  export interface Listener<Info> {
    (info: Info): void
  }
}
