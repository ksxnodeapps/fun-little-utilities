import InitMap from 'advanced-map-initialized'
import MultiKeyMap from 'advanced-map-mutable-multi-key'

type AnyEvent = string | symbol
type AnyListener = (...args: any[]) => void

export interface EventTarget<Event = AnyEvent, Listener = AnyListener> {
  readonly addListener: ListenerModifier<Event, Listener>
  readonly removeListener: ListenerModifier<Event, Listener>
}

export interface ListenerModifier<Event, Listener> {
  (event: Event, listener: Listener): void
}

export interface ListenerTransformer<Event, Listener> {
  (param: ListenerTransformer.Param<Event, Listener>): Listener
}

export namespace ListenerTransformer {
  export interface Param<Event, Listener> {
    readonly event: Event
    readonly listener: Listener
  }
}

export abstract class EventTargetProxy<Event, Listener> implements EventTarget<Event, Listener> {
  public abstract readonly addListener: ListenerModifier<Event, Listener>
  public abstract readonly removeListener: ListenerModifier<Event, Listener>
}

/**
 * Create an event proxy
 * @param target An `EventTarget` - object that has `addListener()` and `removeListener()` methods
 * @param transform A function that takes an event name and a listener then returns a listener
 * @returns An `EventTarget` that acts like a proxy of `target`
 */
export function create<
  Event = AnyEvent,
  Listener = AnyListener
> (
  target: EventTarget<Event, Listener>,
  transform: ListenerTransformer<Event, Listener>
): create.EvtTrgPrx<Event, Listener> {
  type UserProvidedListener = Listener
  type TransformedListener = Listener
  type Mod = ListenerModifier<Event, Listener>

  /**
   * This class is used to create `listeners` object
   *
   * It is in this class that key pairs are compared
   */
  class LocalMultiKeyMap extends MultiKeyMap<
    [Event, UserProvidedListener],
    TransformedListener
  > {
    constructor () {
      super(Map)
    }
  }

  /**
   * This class is used to create `listeners` object
   *
   * It is in this class that `TransformedListener`s are created
   */
  class LocalInitMap extends InitMap<
    [Event, UserProvidedListener],
    TransformedListener,
    LocalMultiKeyMap
  > {
    constructor () {
      super(
        LocalMultiKeyMap,
        ([event, listener]) => transform({ event, listener })
      )
    }
  }

  /**
   * This object has two purposes:
   *   * Create `TransformedListener` from new `[Event, ProvidedListener]` via `transform`
   *   * Lookup a created `TransformedListener` from old `[Event, ProvidedListener]`
   */
  const listeners = new LocalInitMap()

  const add: Mod = (event, listener) => {
    const transformed = listeners.get([event, listener])
    target.addListener(event, transformed)
  }

  const remove: Mod = (event, listener) => {
    if (!listeners.has([event, listener])) return
    const transformed = listeners.get([event, listener])
    target.removeListener(event, transformed)
    listeners.delete([event, listener])
  }

  class EvtTrgPrx extends EventTargetProxy<Event, Listener> {
    public readonly addListener = add
    public readonly removeListener = remove
  }

  return new EvtTrgPrx()
}

export namespace create {
  export type EvtTrgPrx<Event, Listener> = EventTargetProxy<Event, Listener>
  export const EvtTrgPrx = EventTargetProxy
}

export default create
