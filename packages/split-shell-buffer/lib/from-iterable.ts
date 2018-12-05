import * as types from './types'
import SplitterObject from './splitter-object'
import create from './create'
export = (data: types.Data): SplitterObject => create({ data })
