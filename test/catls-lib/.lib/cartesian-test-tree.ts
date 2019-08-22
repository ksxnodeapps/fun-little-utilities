import { Tuple } from 'ts-toolbelt'
import Prepend = Tuple.Prepend

function init () {
  const add = <Factor, Base extends init.MaybeLayer<any, any, any>> (
    factorList: Factor[],
    getDescription: init.DescFunc<Factor>,
    base: Base
  ): init.Layer<Factor, Base, init.Layer.GetBaseParam<Base>> => ({
    factorList,
    getDescription,
    base,
    run: (() => {
      const { makeParam, execute } = base
        ? {
          makeParam: (factor: Factor, baseParam: any[]) => [...baseParam, factor],
          execute: base.run as (fn: init.RunCallback<init.Layer.GetBaseParam<Base>>) => void
        }
        : {
          makeParam: (factor: Factor) => [factor],
          execute: (fn: init.RunCallback<init.Layer.GetBaseParam<Base>>) => void (fn as any)([])
        }

      return (fn: init.RunCallback<init.Layer.GetBaseParam<Base>>) => execute((baseParam: any[]) => {
        for (const factor of factorList) {
          const param = makeParam(factor, baseParam)
          describe(getDescription(factor), () => (fn as any)(param))
        }
      })
    })() as any
  })

  const mkres = <
    Base extends init.MaybeLayer<any, any, any>
  > (base: Base): init.Result<Base> => ({
    add<Factor> (
      factorList: Factor[],
      getDescription: init.DescFunc<Factor>
    ) {
      return mkres(add(factorList, getDescription, base))
    },
    run: base ? base.run as any : () => undefined,
    base
  })

  return mkres(undefined)
}

namespace init {
  export interface DescFunc<Factor> {
    (factor: Factor): string
  }

  export interface Layer<
    Factor,
    Base extends MaybeLayer<any, any, any>,
    BaseParam extends any[]
  > {
    readonly factorList: Factor[]
    readonly getDescription: DescFunc<Factor>
    readonly base: Base
    readonly run: (fn: RunCallback<Prepend<BaseParam, Factor>>) => void
  }

  export namespace Layer {
    export type GetFactor<MaybeLayer, Default = never> =
      MaybeLayer extends Layer<infer X, any, any> ? X : Default

    export type GetBase<MaybeLayer, Default = never> =
      MaybeLayer extends Layer<any, infer X, any> ? X : Default

    export type GetBaseParam<MaybeLayer, Default = never> =
      MaybeLayer extends Layer<any, any, infer X> ? X : Default
  }

  export type MaybeLayer<
    Factor,
    Base extends MaybeLayer<any, any, any>,
    BaseParam extends any[]
  > = Layer<Factor, Base, BaseParam> | undefined

  export interface RunCallback<Args extends any[]> {
    (...args: Args): void
  }

  export interface Result<Base extends MaybeLayer<any, any, any>> {
    add<Factor> (
      factorList: Factor[],
      getDescription: DescFunc<Factor>
    ): Result<Layer<Factor, Base, Layer.GetBaseParam<Base>>>

    run (fn: RunCallback<Layer.GetBaseParam<Base>>): void

    base: Base
  }
}

export = init
