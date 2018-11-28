import EventEmitter from 'events'
import { EventTarget } from 'event-target-proxy'
import assert from 'static-type-assert'

assert.compare<EventTarget, EventEmitter>('broaderLeft')
assert.compare<EventTarget<any, any>, EventEmitter>('broaderLeft')
assert.compare<EventTarget<string, (...args: any[]) => any>, EventEmitter>('broaderLeft')
assert.compare<EventTarget<symbol, (...args: any[]) => any>, EventEmitter>('broaderLeft')
