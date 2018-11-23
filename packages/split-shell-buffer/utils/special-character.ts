import { ord } from 'typescript-char-code'

enum SpecialCharacter {
  Start = 0x1B,
  StartFollow = ord('['),
  End = ord('m'),
  Seperator = ord(';'),
  Newline = ord('\n')
}

export = SpecialCharacter
