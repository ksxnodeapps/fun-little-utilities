import { NextFuncLike, NextFunc } from './types'
import createIteratorResult from './create-iterator-result'
export default <Value> (fn: NextFuncLike<Value>): NextFunc<Value> => () => createIteratorResult(fn())
