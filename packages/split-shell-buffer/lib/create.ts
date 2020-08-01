import * as types from './types'
import SplitterObject from './splitter-object'

export function create(param: types.ConstructorOptions): SplitterObject {
  return new SplitterObject(param)
}

export default create
