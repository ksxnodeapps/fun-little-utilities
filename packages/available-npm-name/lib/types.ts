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
    readonly stdin: AsyncIterable<string>
  }
}
