import { ord } from 'typescript-char-code'

export enum SpecialCharacter {
  Start = 0x1B,
  StartFollow = ord('['),
  End = ord('m'),
  Seperator = ord(';'),
  EndOfLine = ord('\n'),
}

export default SpecialCharacter
