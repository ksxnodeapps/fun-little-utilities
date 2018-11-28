import EventEmitter from 'events'
import { enumerate } from 'iter-tools'

import defaultImport, {
  create,
  EventTargetProxy,
  ListenerTransformer,
  EventTarget
} from 'event-target-proxy'

type AnyEvent = string | symbol
type AnyListener = (...args: any[]) => void
type AnyTransformer = ListenerTransformer<AnyEvent, AnyListener>

class Init<Target extends EventTarget<any, any>> {
  public readonly target: Target
  public readonly proxy: EventTargetProxy<AnyEvent, AnyListener>
  public readonly getPromise: (event: AnyEvent) => Promise<void>

  constructor (target: Target, transformer: AnyTransformer) {
    this.target = target
    this.proxy = create(target, transformer)

    this.getPromise = event => new Promise(
      resolve => target.addListener(event, () => resolve())
    )
  }
}

class InitEventEmitter extends Init<EventEmitter> {
  public readonly confirmEmittingStopped: () => void
  public readonly whenEmittingStopped: Promise<void>

  constructor (transformer: AnyTransformer) {
    super(new EventEmitter(), transformer)
    const stopEvent = Symbol()
    this.whenEmittingStopped = this.getPromise(stopEvent)
    this.confirmEmittingStopped = () => this.target.emit(stopEvent)
  }
}

class InitAsIs extends InitEventEmitter {
  constructor () {
    super(x => x.listener)
  }
}

it('exports create function by default', () => {
  expect(defaultImport).toBe(create)
})

describe('create()', () => {
  async function handleInit (init: InitEventEmitter, listener: AnyListener) {
    const { proxy, target, confirmEmittingStopped, whenEmittingStopped } = init

    proxy.addListener('a', listener)
    proxy.addListener('b', listener)
    proxy.addListener('c', listener)

    const order = Array.from('abccbccacab')
    order.forEach((x, i) => target.emit(x, [i, x]))
    confirmEmittingStopped()

    await whenEmittingStopped

    return { order, init, listener }
  }

  it('creates an instance of EventTargetProxy', () => {
    const { proxy } = new InitAsIs()
    expect(proxy).toBeInstanceOf(EventTargetProxy)
  })

  describe('when transformer that merely returns provided listener as-is', () => {
    it('calls provided listener as-is', async () => {
      const init = new InitAsIs()
      const record = Array<any>()

      const listener = (x: any) => record.push(x)
      const { order } = await handleInit(init, listener)

      expect(record).toEqual(
        Array.from(enumerate(order))
      )
    })

    describe('when emitter emits wrong event', () => {
      it('does not all listener', async () => {
        const { proxy, target, confirmEmittingStopped, whenEmittingStopped } = new InitAsIs()
        const record = Array<any>()

        const listener = (x: any) => record.push(x)
        proxy.addListener('a', listener)
        proxy.addListener('b', listener)
        proxy.addListener('c', listener)

        for (const event of 'qwerty') {
          target.emit(event)
        }

        confirmEmittingStopped()

        await whenEmittingStopped

        expect(record).toEqual([])
      })
    })
  })

  describe('with transformer that ignores provided transformer', () => {
    it('ignores provided listener', async () => {
      const provided = (x: any) => recordProvided.push(x)
      const replacement = (x: any) => recordReplacement.push(x)

      const replace: AnyTransformer = x => {
        recordTransformation.push(x)
        return replacement
      }

      const recordProvided = Array<any>()
      const recordReplacement = Array<any>()
      const recordTransformation = Array<any>()

      const init = new InitEventEmitter(replace)

      const { order } = await handleInit(init, provided)

      expect({
        recordProvided,
        recordReplacement,
        recordTransformation
      }).toEqual({
        recordProvided: [],
        recordReplacement: Array.from(enumerate(order)),
        recordTransformation: Array.from('abc').map(event => ({ event, listener: provided }))
      })
    })
  })

  describe('with a transformer that transform parameters', () => {
    it('calls provided provided listener with the transformed parameters', async () => {
      const { target, proxy, confirmEmittingStopped, whenEmittingStopped } = new InitEventEmitter(
        ({ event, listener }) => (value: any) => listener({ event, listener, value })
      )

      const record = Array<any>()

      const listener = (x: any) => record.push(x)
      proxy.addListener('a', listener)
      proxy.addListener('b', listener)
      proxy.addListener('c', listener)

      const order = Array.from('aaccbca')
      order.forEach((x, i) => target.emit(x, i))
      confirmEmittingStopped()

      await whenEmittingStopped

      expect(record).toEqual(
        order.map((event, value) => ({ event, value, listener }))
      )
    })
  })
})

describe('create.EvtTrgPrx', () => {
  it('is EventTargetProxy', () => {
    expect(create.EvtTrgPrx).toBe(EventTargetProxy)
  })
})
