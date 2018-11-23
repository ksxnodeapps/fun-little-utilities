import { slice } from 'iter-tools'
import createArrayEqual from 'create-array-equal'
import SpecialCharacter from './utils/special-character'
import Digit from './utils/digit'
import StringWritable from './utils/string-writable'
import { isResetSequence } from './utils/sequence-tests'

const { Start, StartFollow, End, EndOfLine } = SpecialCharacter
const { Zero } = Digit
const arrayEqual = createArrayEqual<Splitter.Sequence>()
const RESET = [Start, StartFollow, Zero, End]

class Splitter implements Iterable<Splitter.Element> {
  private readonly data: Splitter.Data
  private readonly prefix: Splitter.Sequence
  private readonly suffix: Splitter.Sequence

  constructor (options: Splitter.ConstructorOptions) {
    this.data = options.data
    this.prefix = options.prefix || []
    this.suffix = options.suffix || []
  }

  public * [Symbol.iterator] (): IterableIterator<Splitter.Element> {
    const { data, prefix, suffix } = this
    let escape = Array<Splitter.Sequence>()
    let newEscape = Array<Splitter.Sequence>()
    let currentEscape: Splitter.Sequence = []
    let isInEscape = false
    let currentLine: Splitter.Sequence = []

    const createYieldValue = (): Splitter.Element => ({
      format: Array.from(escape),
      reset: escape.length ? RESET : [],
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

    for (const char of data) {
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
            if (isResetSequence(slice(2, currentEscape))) {
              newEscape = [] // empty newEscape if meet '\e[0m'
            } else {
              newEscape.push([...currentEscape, End]) // otherwise, add '\e[Xm'
            }

            currentEscape = []
          }

          pushCurrentLine(char)
          break

        // Restore SGR state from previous line
        case EndOfLine:
          yield createYieldValue()
          currentLine = []
          escape = [...escape, ...newEscape]
          newEscape = []
          break

        // When the character is not special
        default:
          if (isInEscape) pushCurrentEscape(char)
          pushCurrentLine(char)
      }
    }

    yield createYieldValue()
  }

  public toString (options: Splitter.toString.Options = {}): string {
    const { finalNewLine, ...rest } = options
    const writable = new StringWritable(rest)

    if (finalNewLine) {
      this.writeln(writable)
    } else {
      this.write(writable)
    }

    return writable.toString()
  }

  public static fromString (text: string) {
    return new Splitter({
      data: new Buffer(text)
    })
  }

  public * lines (): IterableIterator<Splitter.Sequence> {
    for (const element of this) {
      const { format, reset, main, prefix, suffix } = element
      yield [...reset, ...prefix, ...format.flat(1), ...main, ...suffix]
    }
  }

  public write (writable: Splitter.Writable): void {
    let mkline = (line: Splitter.Sequence): Array<number> => {
      mkline = line => [EndOfLine, ...line] // non-first lines have leading eol
      return [...line] // first line has no leading eol
    }

    for (const line of this.lines()) {
      writable.write(Buffer.from(mkline(line)))
    }
  }

  public writeln (writable: Splitter.Writable): void {
    for (const line of this.lines()) {
      writable.write(Buffer.from([...line, EndOfLine]))
    }
  }
}

namespace Splitter {
  export type Code = number
  export type Sequence = ArrayLike<Code>
  export type Data = Iterable<Code>

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
