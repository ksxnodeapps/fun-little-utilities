import path from 'path'
import assert from 'static-type-assert'
import create from 'better-path-join'
const join = create(path)
assert<(a: string, b: string) => string>(join)
assert<string>(join('a', 'b'))
