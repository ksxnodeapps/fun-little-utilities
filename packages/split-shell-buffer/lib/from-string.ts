import SplitterObject from './splitter-object'
import fromIterable from './from-iterable'
export = (text: string): SplitterObject => fromIterable(Buffer.from(text))
