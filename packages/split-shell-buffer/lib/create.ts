import * as types from './types'
import SplitterObject from './splitter-object'

function create (param: types.ConstructorOptions): SplitterObject {
  return new SplitterObject(param)
}

export = create
