import * as types from './types'
import SplitterObject from './splitter-object'

function create (param: types.create.Param): SplitterObject {
  return new SplitterObject(param)
}

export = create
