interface Yargs<Data> {
  readonly argv: Data & {
    readonly _: ReadonlyArray<string>
    readonly $0: string
  }

  help (): this

  alias (short: MaybeArray<string>, long: MaybeArray<string> ): this
  alias (aliases: { [name: string]: MaybeArray<string> }): this

  example (command: string, description: string): this

  env (name: string): this

  option<
    Name extends string,
    Choices extends ReadonlyArray<string | number>
  > (
    name: Name,
    desc: ChoicesDesc<Choices>
  ): AddData<Data, Name, IterableElement<Choices>>

  option<
    Name extends string,
    Value
  > (
    name: Name,
    desc: CoercedDesc<'string', string, Value>
  ): AddData<Data, Name, Value>

  option<
    Name extends string,
    Value
  > (
    name: Name,
    desc: CoercedDesc<'number', number, Value>
  ): AddData<Data, Name, Value>

  option<
    Name extends string,
    Value
  > (
    name: Name,
    desc: CoercedDesc<'boolean', boolean, Value>
  ): AddData<Data, Name, Value>

  option<
    Name extends string
  > (
    name: Name,
    desc: Desc<'string', string>
  ): AddData<Data, Name, string>

  option<
    Name extends string
  > (
    name: Name,
    desc: Desc<'number', number>
  ): AddData<Data, Name, number>

  option<
    Name extends string
  > (
    name: Name,
    desc: Desc<'boolean', boolean>
  ): AddData<Data, Name, boolean>

  option<
    Name extends string
  > (
    name: Name,
    desc: Desc<string, any> | CoercedDesc<string, any, any>
  ): AddData<Data, Name, any>
}

type IterableElement<Iter> =
  Iter extends Iterable<infer Element> ? Element : never

type MaybeArray<Value> = Value | ReadonlyArray<Value>

type SingleOptionDict<Name extends string, Type> =
  { readonly [name in Name]: Type }

type Desc<TypeName, Type> = SharedDescProperties & {
  readonly type: TypeName
} & (
  { readonly default: Type, readonly required?: false } |
  { readonly required: true }
)

type CoercedDesc<
  TypeName,
  Param,
  Return
> = SharedDescProperties & {
  readonly type: TypeName
  readonly coerce: (param: Param) => Return
} & (
  { readonly default: Param, readonly required?: false } |
  { readonly required: true }
)

type ChoicesDesc<
  Choices extends ReadonlyArray<any>
> = SharedDescProperties & {
  readonly choices: Choices
} & (
  { readonly default: IterableElement<Choices>, readonly required?: false } |
  { readonly required: true }
)

type AddData<Data, Name extends string, Value> =
  Yargs<Data & SingleOptionDict<Name, Value>>

interface SharedDescProperties {
  readonly describe?: string
  readonly alias?: MaybeArray<string>
}

declare const yargs: Yargs<{}>
export = yargs
