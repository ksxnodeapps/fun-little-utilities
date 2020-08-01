// tslint:disable:no-floating-promises

import assert from 'static-type-assert'
import awaitEvent from 'ts-await-event'

type Event = 'Event'
type Param = 'Param'

const target = {
  once(event: Event, listener: (param: Param) => void): void {
    console.log({ event, listener })
  },
}

assert<
  Promise<Param>
>(awaitEvent(target, 'Event'))
