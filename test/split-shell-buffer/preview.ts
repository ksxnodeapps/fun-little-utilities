import Splitter from 'split-shell-buffer'
import { styledText } from './.lib/data'

console.info('ORIGINAL')
console.info(styledText)
console.info()

console.info('SPLITTED')
console.info(Splitter.fromString(styledText).toString())
console.info()

console.info('SPLITTED AND INDENTED')
console.info(Splitter.fromString(styledText).withIndent(4).toString())
console.info()
