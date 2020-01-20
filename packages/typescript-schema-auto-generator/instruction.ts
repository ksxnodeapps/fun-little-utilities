import { Instruction } from './types'

export const listSymbolInstruction = (instruction: Instruction) =>
  instruction.list || (instruction.symbol ? [instruction] : [])
