import { Prepend } from 'typescript-tuple'

function init () {
  const add = <Factor, Base extends init.MaybeLayer<any, any>> (
    factorList: Factor[],
    getDescription: init.DescFunc<Factor>,
    base: Base
  ): init.Layer<Factor, Base> => ({
    factorList,
    getDescription,
    base,
    run: (() => {
      const { makeParam, execute } = base
        ? {
          makeParam: (factor: Factor, baseParam: any[]) => [...baseParam, factor],
          execute: base.run as (fn: init.RunCallback<Base>) => void
        }
        : {
          makeParam: (factor: Factor) => [factor],
          execute: (fn: init.RunCallback<Base>) => void fn([])
        }

      return (fn: init.RunCallback<Base>) => execute((baseParam: any[]) => {
        for (const factor of factorList) {
          const param = makeParam(factor, baseParam)
          describe(getDescription(factor), () => fn(param))
        }
      })
    })()
  })

  const mkres = <
    Base extends init.MaybeLayer<any, any>
  > (base: Base): init.Result<Base> => ({
    add<Factor> (
      factorList: Factor[],
      getDescription: init.DescFunc<Factor>
    ) {
      return mkres(add(factorList, getDescription, base))
    },
    run: base ? base.run : () => undefined,
    base
  })

  return mkres(undefined)
}

namespace init {
  export interface DescFunc<Factor> {
    (factor: Factor): string
  }

  export interface Layer<Factor, Base extends MaybeLayer<any, any>> {
    readonly factorList: Factor[]
    readonly getDescription: DescFunc<Factor>
    readonly base: Base
    readonly run: (fn: RunCallback<Base>) => void
  }

  export type MaybeLayer<
    Factor,
    Base extends MaybeLayer<any, any>
  > = Layer<Factor, Base> | undefined

  export type RunCallback<
    Type extends MaybeLayer<any, any>,
    Holder extends any[] = []
  > = {
    undefined:
      (param: Holder) => void,
    defined:
      Type extends Layer<infer Factor, infer Base> ?
      Base extends MaybeLayer<any, any> ?
        RunCallback<Base, Prepend<Holder, Factor>>
      : { ERROR: 'Base does not fit MaybeLayer<any, any>', Base: Base }
      : { ERROR: 'Type does not fit Layer<any, any>', Type: Type }
    invalidType:
      { ERROR: 'Type does not fit MaybeLayer<any, any>', Type: Type, Holder: Holder }
  }[
    Type extends undefined ? 'undefined' :
    Type extends Layer<any, any> ? 'defined' :
    'invalidType'
  ]

  export interface Result<Base extends MaybeLayer<any, any>> {
    add<Factor> (
      factorList: Factor[],
      getDescription: DescFunc<Factor>
    ): Result<Layer<Factor, Base>>

    run (fn: RunCallback<Base>): void

    base: Base
  }
}

export = init
