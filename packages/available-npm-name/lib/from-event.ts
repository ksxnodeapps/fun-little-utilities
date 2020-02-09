import { fromEventPattern } from 'rxjs'
import { Event } from './types'

/** Convert a node event target to an observable */
export const fromEvent = <Type, Info> (
  target: Event.Target<Type, Info>,
  type: Type
) => fromEventPattern<Info>(
  listener => target.addListener(type, listener),
  listener => target.removeListener(type, listener)
)

export default fromEvent
