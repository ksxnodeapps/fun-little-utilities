import Splitter from 'split-shell-buffer'
import { styledText } from './.lib/data'

console.info(styledText)
console.info()
console.info(Splitter.fromString(styledText).toString())
console.info()
