import assert from 'static-type-assert'

import {
  WritableJsonValue,
  WritableJsonObject,
  ReadonlyJsonValue,
  load,
  dump,
} from 'just-json-type'

const ANY: any = null
const symbol = Symbol('symbol')

export function testLoad() {
  // simplest use case
  assert<WritableJsonValue<never>>(load('{}'))

  // with simple reviver
  assert<WritableJsonValue<never>>(load('{}', function (key, value) {
    assert<WritableJsonObject<never>>(this)
    assert<WritableJsonValue<never>>(this[key])
    assert<WritableJsonValue<never>>(value)
    return value
  }))

  // with reviver that returns other value
  assert<WritableJsonValue<typeof symbol>>(load('{}', function (key, value) {
    assert<WritableJsonObject<never>>(this)
    assert<WritableJsonValue<never>>(this[key])
    assert<WritableJsonValue<never>>(value)
    return symbol
  }))

  // with reviver that may return other value
  assert<WritableJsonValue<typeof symbol>>(load('{}', function (key, value) {
    assert<WritableJsonObject<never>>(this)
    assert<WritableJsonValue<never>>(this[key])
    assert<WritableJsonValue<never>>(value)
    return key ? symbol : value
  }))
}

export function testDump() {
  // simple use case
  assert<string>(dump(ANY as ReadonlyJsonValue<never>))
  assert<string>(dump('abc'))
  assert<string>(dump(123))
  assert<string>(dump(null))
  assert<string>(dump(true))
  assert<string>(dump(false))
  assert<string>(dump({ s: 'abc', n: 123, N: null, T: true, F: false, o: {}, a: [] } as const))
  assert<string>(dump(['abc', 123, null, true, false, {}, []] as const))

  // with reviver
  const object = {
    string: 'abc',
    number: 123,
    null: null,
    true: true,
    false: false,
    object: { a: 0, b: 1, c: 2 },
    array: [0, 1, 2, 'a', 'b', 'c'],
  } as const
  assert<string>(dump(object, function (key, value) {
    assert<WritableJsonObject<WritableJsonValue<never>>>(this)
    assert<string>(key)
    assert<WritableJsonValue<never>>(value)
    return value
  }))
}
