export function awaitEvent<Event, Param> (
  target: awaitEvent.Target<Event, Param>,
  event: Event
): Promise<Param> {
  return new Promise<Param>(
    resolve =>
      target.once(event, param => resolve(param))
  )
}

export namespace awaitEvent {
  export interface Target<Event, Param> {
    once (event: Event, listener: Listener<Param>): void
  }

  export interface Listener<Param> {
    (param: Param): void
  }
}

export default awaitEvent
