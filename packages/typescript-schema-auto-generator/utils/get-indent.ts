export function getIndent (instruction: 'tab' | 'none' | number = 2) {
  switch (instruction) {
    case 'tab':
      return '\t'
    case 'none':
      return undefined
  }
  return instruction
}

export default getIndent
