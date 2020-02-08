export const enum Status {
  InvalidName = 0b0100,
  NetworkError = 0b0010,
  Occupied = 0b0001,
  Available = 0b0000
}

export namespace Fetch {
  export interface Fn {
    (url: string): Promise<Response>
  }

  export interface Response {
    readonly status: number
  }
}
