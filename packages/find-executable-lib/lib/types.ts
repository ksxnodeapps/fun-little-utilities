import DisplaySelection from './display-selection'

export type FindingResult = FindingResult.Found | FindingResult.NotFound

export namespace FindingResult {
  export interface NotFound {
    readonly found: false
  }

  export interface Found {
    readonly found: true
    readonly word: string
    readonly path: string
  }
}

export interface CommandLineOptions {
  readonly _: ReadonlyArray<string>
  readonly filter: DisplaySelection
}
