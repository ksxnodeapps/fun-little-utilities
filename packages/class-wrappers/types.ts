export type AnyKey = string | number | symbol

export interface AnyClass {
  new (...args: any[]): any
}

export type FilterObjectKeys<Object, Key extends keyof Object> = {
  readonly [key in Key]: Object[key]
}

export type ConstructorInfo<Class extends AnyClass> =
  Class extends new (...args: infer Param) => infer Instance
    ? { param: Param, instance: Instance }
    : never

export type WrappedConstructor<Class extends AnyClass, Key extends AnyKey> =
  Class extends new (...args: infer Param) => infer Instance
    ? new (...args: Param) => FilterObjectKeys<Instance, Key & keyof Instance>
    : never

export type WrappingFuncSet<Object, Key extends keyof Object> = {
  [key in Key]: WrappingFuncSet.Value<Object, key>
}

export namespace WrappingFuncSet {
  export interface Value<Object, Key extends keyof Object> {
    (param: Param<Object, Key>): Object[Key]
  }

  export interface Param<Object, Key extends keyof Object> {
    readonly object: Object
    readonly key: Key
    readonly value: Object[Key]
  }
}
