import { EventEmitter as RealEventEmitter } from 'events'
import { combinations, repeat } from 'iter-tools'

import defaultImport, {
  create,
  EventTargetProxy,
  EventTarget,
  ListenerTransformer
} from 'event-target-proxy'

type AnyEvent = string | symbol
type AnyListener = (...args: any[]) => void
type AnyTransformer = ListenerTransformer<AnyEvent, AnyListener, AnyListener>

function expectPairsFrom<Element> (collection: Iterable<Element>) {
  type Pair = [Element, Element]
  const equalPairs = new Set<Pair>()
  const notEqualPairs = new Set<Pair>()

  const mkfn = (act: () => void) => (equal: expectPairsFrom.Equal<Element> = Object.is) => {
    equalPairs.clear()
    notEqualPairs.clear()

    for (const pair of combinations(collection, 2)) {
      if (equal(...pair)) {
        equalPairs.add(pair)
      } else {
        notEqualPairs.add(pair)
      }
    }

    act()
  }

  return {
    toBeAllEqual: mkfn(() => {
      expect({ equalPairs, notEqualPairs }).toEqual({
        equalPairs,
        notEqualPairs: new Set()
      })
    }),

    not: {
      toBeAllEqual: mkfn(() => {
        expect({ notEqualPairs }).not.toEqual({
          notEqualPairs: new Set()
        })
      })
    }
  }
}

namespace expectPairsFrom {
  export type Equal<X> = (a: X, b: X) => boolean
}

class MockedEventEmitter extends RealEventEmitter implements EventTarget<any, any> {
  public readonly recordedActions = Array<MockedEventEmitter.RecordedAction>()

  public addListener (event: any, listener: any): this {
    this.recordedActions.push({
      action: 'addListener',
      event,
      listener
    })

    return super.addListener(event, listener)
  }

  public removeListener (event: any, listener: any): this {
    this.recordedActions.push({
      action: 'removeListener',
      event,
      listener
    })

    return super.removeListener(event, listener)
  }
}

namespace MockedEventEmitter {
  export interface RecordedAction {
    readonly action: 'addListener' | 'removeListener'
    readonly event: any
    readonly listener: any
  }
}

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

class InitEventEmitter extends Init<MockedEventEmitter> {
  constructor (transformer: AnyTransformer) {
    super(new MockedEventEmitter(), transformer)
  }
}

class InitAsIs extends InitEventEmitter {
  constructor () {
    super(x => x.listener)
  }
}

class InitRetAsIs extends InitEventEmitter {
  constructor () {
    super(({ listener }) => (...args: any[]) => listener(...args))
  }
}

it('exports create function by default', () => {
  expect(defaultImport).toBe(create)
})

describe('create', () => {
  it('creates an instance of EventTargetProxy', () => {
    const proxy = create(new MockedEventEmitter(), x => x.listener)
    expect(proxy).toBeInstanceOf(EventTargetProxy)
  })
})

describe('create.EvtTrgPrx', () => {
  it('is EventTargetProxy', () => {
    expect(create.EvtTrgPrx).toBe(EventTargetProxy)
  })
})

describe('EventTargetProxy::addListener', () => {
  it('calls target.addListener', () => {
    const { target, proxy } = new InitAsIs()
    const listener = () => undefined

    for (const event of 'abc') {
      proxy.addListener(event, listener)
    }

    expect(
      target.recordedActions.map(x => x.action)
    ).toEqual(
      Array.from('abc').fill('addListener')
    )
  })

  it('calls target.addListener with correct event arguments', () => {
    const { target, proxy } = new InitAsIs()
    const listener = () => undefined

    for (const event of 'abc') {
      proxy.addListener(event, listener)
    }

    expect(
      target.recordedActions.map(x => x.event)
    ).toEqual(
      Array.from('abc')
    )
  })

  describe('with a transformer that merely returns provided listener as-is', () => {
    it('calls target.addListener on provided listener', () => {
      const { target, proxy } = new InitAsIs()
      const listener = () => undefined

      for (const event of 'abc') {
        proxy.addListener(event, listener)
      }

      expect(target.recordedActions).toEqual(
        Array
          .from('abc')
          .map(event => ({ action: 'addListener', event, listener }))
      )
    })
  })

  describe('with a transformer that returns a new listener', () => {
    describe('when all events are different from one another', () => {
      const { target, proxy } = new InitRetAsIs()
      const listener = () => undefined

      for (const event of 'abc') {
        proxy.addListener(event, listener)
      }

      it('does not call target.addListener on provided listener', () => {
        expect(
          target.recordedActions.map(x => x.listener)
        ).not.toContain(listener)
      })

      it('does not call target.addListener on the same listener', () => {
        expectPairsFrom(
          target.recordedActions.map(x => x.listener)
        ).not.toBeAllEqual()
      })
    })

    describe('when all events are the same', () => {
      const { target, proxy } = new InitRetAsIs()
      const listener = () => undefined
      const times = 5

      for (const event of repeat('event', times)) {
        proxy.addListener(event, listener)
      }

      it('does not call target.addListener on provided listener', () => {
        expect(
          target.recordedActions.map(x => x.listener)
        ).not.toContain(listener)
      })

      it('calls target.addListener on the same listener', () => {
        expectPairsFrom(
          target.recordedActions.map(x => x.listener)
        ).toBeAllEqual()
      })
    })
  })
})

describe('EventTargetProxy::removeListener', () => {
  describe('when listeners do not exist', () => {
    it('does not call event.removeListener', () => {
      const { target, proxy } = new InitAsIs()

      for (const event of 'abbccc') {
        proxy.removeListener(event, () => undefined)
      }

      expect(target.recordedActions).toEqual([])
    })
  })

  describe('when listeners exist', () => {
    it('calls target.removeListener', () => {
      const { target, proxy } = new InitAsIs()
      const listener = () => undefined

      for (const event of 'abc') {
        proxy.addListener(event, listener)
      }

      for (const event of 'abc') {
        proxy.removeListener(event, listener)
      }

      expect(
        target.recordedActions.map(x => x.action)
      ).toEqual([
        ...Array.from('abc').fill('addListener'),
        ...Array.from('abc').fill('removeListener')
      ])
    })

    it('calls target.removeListener once for each event/listener pair', () => {
      const { target, proxy } = new InitAsIs()
      const listener = () => undefined

      for (const event of 'abbccc') {
        proxy.addListener(event, listener)
      }

      for (const event of 'abbccc') {
        proxy.removeListener(event, listener)
      }

      expect(
        target.recordedActions
      ).toEqual([
        ...Array
          .from('abbccc')
          .map(event => ({ action: 'addListener', event, listener })),
        ...Array
          .from('abc')
          .map(event => ({ action: 'removeListener', event, listener }))
      ])
    })

    it('calls target.removeListener with correct event arguments', () => {
      const { target, proxy } = new InitAsIs()
      const listener = () => undefined

      for (const event of 'abc') {
        proxy.addListener(event, listener)
      }

      for (const event of 'abc') {
        proxy.removeListener(event, listener)
      }

      expect(
        target.recordedActions.map(x => x.event)
      ).toEqual(
        Array.from('abcabc')
      )
    })

    describe('with a transformer that merely returns provided listener as-is', () => {
      it('calls target.removeListener on provided listener', () => {
        const { target, proxy } = new InitAsIs()
        const listener = () => undefined

        for (const event of 'abc') {
          proxy.addListener(event, listener)
        }

        for (const event of 'abc') {
          proxy.removeListener(event, listener)
        }
        expect(target.recordedActions).toEqual([
          ...Array
            .from('abc')
            .map(event => ({ action: 'addListener', event, listener })),
          ...Array
            .from('abc')
            .map(event => ({ action: 'removeListener', event, listener }))
        ])
      })
    })

    describe('with a transformer that returns a new listener', () => {
      describe('when all events are different from one another', () => {
        const { target, proxy } = new InitRetAsIs()
        const listener = () => undefined

        for (const event of 'abc') {
          proxy.addListener(event, listener)
        }

        for (const event of 'abc') {
          proxy.removeListener(event, listener)
        }

        it('does not call target.removeListener on provided listener', () => {
          expect(
            target.recordedActions.map(x => x.listener)
          ).not.toContain(listener)
        })

        it('does not call target.removeListener on the same listener', () => {
          expectPairsFrom(
            target.recordedActions.map(x => x.listener)
          ).not.toBeAllEqual()
        })
      })

      describe('when all events are the same', () => {
        const { target, proxy } = new InitRetAsIs()
        const listener = () => undefined
        const times = 5

        for (const event of repeat('event', times)) {
          proxy.removeListener(event, listener)
        }

        it('does not call target.removeListener on provided listener', () => {
          expect(
            target.recordedActions.map(x => x.listener)
          ).not.toContain(listener)
        })
      })
    })
  })
})
