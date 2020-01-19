import { Instruction } from './types'

export const listSymbolInstruction = (instruction: Instruction) =>
  'list' in instruction ? instruction.list : [instruction]
