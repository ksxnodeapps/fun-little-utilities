import Splitter from 'split-shell-buffer'

const styledText = [
  'abc \x1B[1mdef \x1B[2m',
  'ghi \x1B[0;0mjkl \x1B[91;22;3m',
  'mno pqrs \x1B[m',
  'tuv wxyz'
].join('\n')

console.info(styledText)
console.info()
console.info(Splitter.fromString(styledText).toString())
console.info()
