import {
  WrappingFuncSet
} from './types'

export const transformer: {
  <
    Object,
    Key extends keyof Object
  > (
    fn: WrappingFuncSet.Value<Object, Key>
  ): WrappingFuncSet.Value<Object, Key>
} = fn => fn
