import EventEmitter from 'events'
import awaitEvent from 'ts-await-event'

type Event = typeof event
type Param = typeof param

const event = Symbol()
const param = Symbol()

class EventTargetInstance extends EventEmitter implements awaitEvent.Target<Event, Param> {
  once (event: Event, listener: awaitEvent.Listener<Param>): this {
    super.once(event, listener as any)
    return this
  }
}

it('resolves', async () => {
  const target = new EventTargetInstance()
  setTimeout(() => target.emit(event, param), 200)
  expect(await awaitEvent(target, event)).toBe(param)
})
