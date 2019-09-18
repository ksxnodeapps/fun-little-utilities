import { slice } from 'iter-tools'
import createArrayEqual from 'create-array-equal'
import SpecialCharacter from '../utils/special-character'
import Digit from '../utils/digit'
import { isResetSequence } from '../utils/sequence-tests'
import callMaybeFunction from '../utils/call-maybe-function'
import * as types from './types'

const { Start, StartFollow, End, EndOfLine } = SpecialCharacter
const { Zero } = Digit
const arrayEqual = createArrayEqual<types.Sequence>()
const RESET = [Start, StartFollow, Zero, End]

export async function * iterateElements (splitter: types.Splitter): AsyncIterableIterator<types.Element> {
  const { data, prefix, suffix } = splitter
  let leadingCharacters = Array<types.Sequence>()
  let nextLeadingCharacters = Array<types.Sequence>()
  let currentEscape: types.Sequence = []
  let isInEscape = false
  let currentLine: types.Sequence = []

  const createYieldValue = (): types.Element => ({
    format: Array.from(leadingCharacters),
    reset: leadingCharacters.length ? RESET : [],
    main: currentLine,
    prefix: callMaybeFunction(prefix, { splitter, currentLine, leadingCharacters }),
    suffix: callMaybeFunction(suffix, { splitter, currentLine, leadingCharacters })
  })

  function pushCurrentLine (char: types.Code) {
    currentLine = [...currentLine, char]
  }

  function pushCurrentEscape (char: types.Code) {
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

export default iterateElements
