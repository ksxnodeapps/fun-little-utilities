import { slice } from 'iter-tools'
import { flatten } from 'ramda'
import createArrayEqual from 'create-array-equal'
import 'monorepo-shared-assets/.polyfill'
import SpecialCharacter from './utils/special-character'
import Digit from './utils/digit'
import StringWritable from './utils/string-writable'
import { isResetSequence } from './utils/sequence-tests'

const { Start, StartFollow, End, EndOfLine } = SpecialCharacter
const { Zero } = Digit
const arrayEqual = createArrayEqual<Splitter.Sequence>()
const RESET = [Start, StartFollow, Zero, End]

class Splitter implements AsyncIterable<Splitter.Element> {
  private readonly data: Splitter.Data
  private readonly prefix: Splitter.Sequence
  private readonly suffix: Splitter.Sequence

  constructor (options: Splitter.ConstructorOptions) {
    this.data = options.data
    this.prefix = options.prefix || []
    this.suffix = options.suffix || []
  }

  public async * [Symbol.asyncIterator] (): AsyncIterableIterator<Splitter.Element> {
    const { data, prefix, suffix } = this
    let leadingCharacters = Array<Splitter.Sequence>()
    let nextLeadingCharacters = Array<Splitter.Sequence>()
    let currentEscape: Splitter.Sequence = []
    let isInEscape = false
    let currentLine: Splitter.Sequence = []

    const createYieldValue = (): Splitter.Element => ({
      format: Array.from(leadingCharacters),
      reset: leadingCharacters.length ? RESET : [],
      main: currentLine,
      prefix,
      suffix
    })

    function pushCurrentLine (char: Splitter.Code) {
      currentLine = [...currentLine, char]
    }

    function pushCurrentEscape (char: Splitter.Code) {
      currentEscape = [...currentEscape, char]
    }

    for await (const char of data) {
      // Handle special characters
      switch (char) {
        case Start:
          currentEscape = [char]
          pushCurrentLine(char)
          break

        case StartFollow:
          if (arrayEqual(currentEscape, [Start])) {
            currentEscape = [Start, StartFollow]
            isInEscape = true
          }

          pushCurrentLine(char)
          break

        case End:
          if (isInEscape) {
            isInEscape = false

            // If meet '\e[m', '\e[0m', '\e[00m'...
            // NOTE: No need for 'm' suffix
            if (isResetSequence(slice({ start: 2 }, currentEscape))) {
              nextLeadingCharacters = [] // empty newEscape if meet '\e[0m'
            } else {
              nextLeadingCharacters.push([...currentEscape, End]) // otherwise, add '\e[Xm'
            }

            currentEscape = []
          }

          pushCurrentLine(char)
          break

        // Restore SGR state from previous line
        case EndOfLine:
          yield createYieldValue()
          currentLine = []
          leadingCharacters = [...nextLeadingCharacters]
          nextLeadingCharacters = []
          break

        // When the character is not special
        default:
          if (isInEscape) pushCurrentEscape(char)
          pushCurrentLine(char)
      }
    }

    yield createYieldValue()
  }

  public async toString (options: Splitter.toString.Options = {}): Promise<string> {
    const { finalNewLine, ...rest } = options
    const writable = new StringWritable(rest)

    if (finalNewLine) {
      await this.writeln(writable)
    } else {
      await this.write(writable)
    }

    return writable.toString()
  }

  public static fromString (text: string): Splitter {
    return new Splitter({
      data: Buffer.from(text)
    })
  }

  public static fromIterableStream (stream: Splitter.IterableStream): Splitter {
    async function * iterate () {
      for await (const chunk of stream) {
        for (const char of Buffer.from(chunk as Buffer)) {
          yield char
        }
      }
    }

    const data = {
      [Symbol.asyncIterator]: iterate
    }

    return new Splitter({ data })
  }

  public static fromEventedStream (stream: Splitter.EventedStream): Splitter {
    let queue = Promise.resolve()

    function addQueue (fn: () => void) {
      queue = queue.then(fn)
    }

    const iterate = (): AsyncIterableIterator<Buffer> => ({
      next: () => new Promise((resolve, reject) => {
        stream.on('data', value => addQueue(
          () => resolve({ done: false, value }))
        )

        stream.on('error', error => addQueue(
          () => reject(error))
        )

        stream.on('close', () => addQueue(
          () => resolve({ done: true, value: undefined as any }))
        )
      }),

      [Symbol.asyncIterator] () {
        return this
      }
    })

    return Splitter.fromIterableStream({
      [Symbol.asyncIterator]: iterate
    })
  }

  public static fromChildProcess (cp: Splitter.ChildProcess): Splitter {
    const { stdout, stderr } = cp

    const stream: Splitter.EventedStream = {
      on (event: any, fn: any) {
        if (event === 'close') {
          cp.on('close', fn)
        } else {
          stdout.on(event, fn)
          stderr.on(event, fn)
        }
      }
    }

    return Splitter.fromEventedStream(stream)
  }

  public async * lines (): AsyncIterableIterator<Splitter.Sequence> {
    // workaround https://github.com/palantir/tslint/issues/3997
    // tslint:disable-next-line:await-promise
    for await (const element of this) {
      const { format, reset, main, prefix, suffix } = element
      const flattenFormat: Splitter.Sequence = flatten(format) as any
      yield [...reset, ...prefix, ...flattenFormat, ...main, ...suffix]
    }
  }

  public withPrefix (prefix: Splitter.Sequence): Splitter {
    const { data, suffix } = this
    return new Splitter({ data, prefix, suffix })
  }

  public withSuffix (suffix: Splitter.Sequence): Splitter {
    const { data, prefix } = this
    return new Splitter({ data, prefix, suffix })
  }

  public withIndent (indent: number): Splitter {
    return this.withPrefix(
      Buffer.from(' '.repeat(indent))
    )
  }

  public async write (writable: Splitter.Writable): Promise<void> {
    let mkline = (line: Splitter.Sequence): Array<number> => {
      mkline = line => [EndOfLine, ...line] // non-first lines have leading eol
      return [...line] // first line has no leading eol
    }

    for await (const line of this.lines()) {
      writable.write(Buffer.from(mkline(line)))
    }
  }

  public async writeln (writable: Splitter.Writable): Promise<void> {
    for await (const line of this.lines()) {
      writable.write(Buffer.from([...line, EndOfLine]))
    }
  }
}

namespace Splitter {
  export type Code = number
  export type Sequence = ArrayLike<Code>
  export type Data = AsyncIterable<Code> | Iterable<Code>
  export type IterableStream = AsyncIterable<Buffer | string>

  export interface ConstructorOptions {
    readonly data: Data
    readonly prefix?: Sequence
    readonly suffix?: Sequence
  }

  export interface Element {
    readonly format: ReadonlyArray<Sequence>
    readonly reset: Sequence
    readonly main: Sequence
    readonly prefix: Sequence
    readonly suffix: Sequence
  }

  export interface Writable {
    write (buffer: Buffer): void
  }

  export interface EventedStream {
    on (event: 'data', listener: EventedStream.DataEventListener): void
    on (event: 'error', listener: EventedStream.ErrorEventListener): void
    on (event: 'close', listener: EventedStream.CloseEventListener): void
  }

  export namespace EventedStream {
    export type DataEventListener = (data: Buffer) => void
    export type ErrorEventListener = (error: any) => void
    export type CloseEventListener = () => void
  }

  export interface ChildProcess {
    readonly stdout: EventedStream
    readonly stderr: EventedStream
    on (event: 'close', listener: ChildProcess.CloseEventListener): void
  }

  export namespace ChildProcess {
    export type CloseEventListener = () => void
  }

  export namespace toString {
    export interface Options extends StringWritable.ConstructorOptions {
      readonly finalNewLine?: boolean
    }
  }

  /**
   * @private
   */
  interface ArrayLike<X> extends Iterable<X> {
    readonly length: number
  }
}

export = Splitter
