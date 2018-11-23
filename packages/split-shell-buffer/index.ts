import { map, reduce, slice } from 'iter-tools'
import createArrayEqual from 'create-array-equal'
import SpecialCharacter from './utils/special-character'
import Digit from './utils/digit'
import { isResetSequence } from './utils/sequence-tests'

const { Start, StartFollow, End, Newline } = SpecialCharacter
const { Zero } = Digit
const arrayEqual = createArrayEqual<Splitter.Element>()

class Splitter implements Iterable<Splitter.Element> {
  private readonly data: Splitter.Data
  private readonly prefix: Splitter.Element
  private readonly suffix: Splitter.Element

  constructor (options: Splitter.ConstructorOptions) {
    this.data = options.data
    this.prefix = options.prefix || []
    this.suffix = options.suffix || [Newline]
  }

  public * [Symbol.iterator] (): IterableIterator<Splitter.Element> {
    const { data } = this
    let escape = Array<Splitter.Element>()
    let newEscape = Array<Splitter.Element>()
    let currentEscape: Splitter.Element = []
    let isInEscape = false
    let currentLine: Splitter.Element = []

    const createYieldValue = (): Splitter.Element => [
      ...escape.flat(),
      ...currentLine,
      ...escape.length
        ? [Start, StartFollow, Zero, End] // '\e[0m'
        : []
    ]

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
        case Newline:
          console.log({ Newline, currentLine })
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

  public toString (): string {
    const { prefix, suffix } = this

    return reduce(
      '',
      (prev, current) => prev + current,
      map(
        line => String.fromCodePoint(...prefix, ...line, ...suffix),
        this
      )
    )
  }

  public static fromString (text: string) {
    return new Splitter({
      data: new Buffer(text)
    })
  }
}

namespace Splitter {
  export type Code = number
  export type Element = ReadonlyArray<Code>
  export type Data = Iterable<Code>

  export interface ConstructorOptions {
    readonly data: Data
    readonly prefix?: Element
    readonly suffix?: Element
  }
}

export = Splitter
