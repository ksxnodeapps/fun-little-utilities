import { splitIterable } from 'split-iterable'

import {
  SPLITTER,
  sep,
  args2arr,
  assertResemble,
  assertNoSplitter,
} from './utils'

const get = <X>(iter: Iterable<X>, sep: (x: X) => boolean) => Array.from(splitIterable(iter, sep))

it('with empty array', () => {
  expect(get([], sep)).toEqual([[]])
})

describe('with iterable that lacks splitter', () => {
  it('makes exactly one chunk', () => {
    expect(get('abcdef', sep)).toHaveProperty('length', 1)
  })

  it('resembles original iterable', () => {
    assertResemble('abcdef', get('abcdef', sep))
  })

  it('does not contain splitter elements', () => {
    assertNoSplitter(get('abcdef', sep))
  })

  it('matches snapshot', () => {
    expect(get('abcdef', sep)).toMatchSnapshot()
  })
})

describe('with iterable that has splitters', () => {
  const iterable = args2arr(0, 1, 2, SPLITTER, 3, 4, SPLITTER, 5)

  it('makes multiple chunks', () => {
    expect(get(iterable, sep)).toHaveProperty('length', 3)
  })

  it('resembles original iterable', () => {
    assertResemble(iterable, get(iterable, sep) as any)
  })

  it('does not contain splitter elements', () => {
    assertNoSplitter(get(iterable, sep))
  })

  it('matches snapshot', () => {
    expect(get(iterable, sep)).toMatchSnapshot()
  })
})

describe('with iterable that has trailing splitters', () => {
  const iterable = args2arr(SPLITTER, 0, 1, 2, SPLITTER, 3, 4, SPLITTER, 5, SPLITTER)

  it('makes multiple chunks', () => {
    expect(get(iterable, sep)).toHaveProperty('length', 3 + 2)
  })

  it('first chunk is empty', () => {
    expect(get(iterable, sep)[0]).toEqual([])
  })

  it('last chunk is empty', () => {
    expect(get(iterable, sep).slice(-1)[0]).toEqual([])
  })

  it('resembles original iterable', () => {
    assertResemble(iterable, get(iterable, sep) as any)
  })

  it('does not contain splitter elements', () => {
    assertNoSplitter(get(iterable, sep))
  })

  it('matches snapshot', () => {
    expect(get(iterable, sep)).toMatchSnapshot()
  })
})
