import { EventEmitter } from 'events'
import create, { EventTarget, EventTargetProxy } from 'event-target-proxy'
import assert from 'static-type-assert'

assert.compare<EventTarget, EventEmitter>('broaderLeft')
assert.compare<EventTarget<any, any>, EventEmitter>('broaderLeft')
assert.compare<EventTarget<string, (...args: any[]) => any>, EventEmitter>('broaderLeft')
assert.compare<EventTarget<symbol, (...args: any[]) => any>, EventEmitter>('broaderLeft')

type Event = 'Event'
type ProvidedParam = 'ProvidedParam'

interface ProvidedListener {
  (x: TransformedParam): void
}

interface TransformedParam {
  readonly event: Event
  readonly listener: ProvidedListener
  readonly param: ProvidedParam
}

interface TransformedListener {
  (x: ProvidedParam): void
}

interface TransformerParam {
  readonly event: Event
  readonly listener: ProvidedListener
}

declare class EventTargetInstance implements EventTarget<Event, TransformedListener> {
  public addListener (event: Event, listener: TransformedListener): void
  public removeListener (event: Event, listener: TransformedListener): void
}

const proxy = create(
  new EventTargetInstance(),
  ({ event, listener }: TransformerParam) => (param: ProvidedParam) => {
    listener({ event, listener, param })
  }
)

assert<EventTargetProxy<Event, ProvidedListener>>(proxy)
assert<(event: Event, listener: ProvidedListener) => void>(proxy.addListener)
assert<(event: Event, listener: ProvidedListener) => void>(proxy.removeListener)

proxy.addListener('Event', param => {
  assert<TransformedParam>(param)
  assert<Event>(param.event)
  assert<ProvidedListener>(param.listener)
  assert<ProvidedParam>(param.param)
})

proxy.removeListener('Event', param => {
  assert<TransformedParam>(param)
  assert<Event>(param.event)
  assert<ProvidedListener>(param.listener)
  assert<ProvidedParam>(param.param)
})
