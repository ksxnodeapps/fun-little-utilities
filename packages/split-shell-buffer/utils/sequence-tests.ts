import { every } from 'iter-tools'
import Splitter from '../index'
import SpecialCharacter from './special-character'
import Digit from './digit'
const { Seperator } = SpecialCharacter
const { Zero } = Digit

const ZERO_AND_SEP = new Set([Zero, Seperator])

export const isResetSequence =
  (sequence: Iterable<Splitter.Code>): boolean =>
    every(x => ZERO_AND_SEP.has(x), sequence)
