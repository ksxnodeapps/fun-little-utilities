import { concat } from 'iter-tools'

import {
  AnyClass,
  ConstructorInfo,
  WrappingFuncSet,
  WrappedConstructor
} from './types'

import {
  DataPropertyWrapper
} from './classes'

export function wrapReadonlyProperties<
  BaseClass extends AnyClass,
  Key extends keyof Info['instance'] = keyof Info['instance'],
  Info extends ConstructorInfo<BaseClass> = ConstructorInfo<BaseClass>,
  Transform extends WrappingFuncSet<Info['instance'], Key> = WrappingFuncSet<Info['instance'], Key>
> (
  Base: BaseClass,
  transform: Transform
): WrappedConstructor<BaseClass, Key> & typeof DataPropertyWrapper {
  const Result = class extends DataPropertyWrapper {
    constructor (...args: ConstructorInfo<BaseClass>['param']) {
      super()
      const object = new Base(...args)
      const allNames = Object.getOwnPropertyNames(transform)
      const allSymbols = Object.getOwnPropertySymbols(transform)

      for (const property of concat<string | symbol>(allNames, allSymbols)) {
        const key: any = property
        const fn: Transform[Key] = (transform as any)[key]
        const value: any = object[key]
        const res = fn ? fn({ key, object, value }) : value
        // @ts-ignore
        this[key] = res
      }
    }
  }

  return Result as any
}
