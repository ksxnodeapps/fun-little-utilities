import SplitterObject from './splitter-object'
import fromIterable from './from-iterable'
export const fromString = (text: string): SplitterObject => fromIterable(Buffer.from(text))
export default fromString
