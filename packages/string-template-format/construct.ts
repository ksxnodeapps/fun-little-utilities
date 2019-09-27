import compose from './compose'
import Tag from './tag'

export interface Constructor<X, Y> {
  new (x: X): Y
}

export interface CallableConstructor<X, Y> {
  (x: X): Y
}

export const CallableConstructor =
  <X, Y> (cls: Constructor<X, Y>): CallableConstructor<X, Y> => x => new cls(x)

export const construct = <Fx, Gy, FyGx> (
  g: Constructor<FyGx, Gy>,
  f: Tag<Fx, FyGx>
): Tag<Fx, Gy> => compose(CallableConstructor(g), f)

export default construct
