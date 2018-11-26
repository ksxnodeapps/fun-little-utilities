const mkfn =
  <Fn extends typeof it | typeof describe>
    (fn: Fn) => (condition: boolean): Fn => (condition ? fn : fn.skip) as Fn

export const mkIt = mkfn(it)
export const mkDesc = mkfn(describe)
