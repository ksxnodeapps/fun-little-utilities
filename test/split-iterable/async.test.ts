import { splitAsyncIterable } from 'split-iterable'

import {
  SPLITTER,
  sep,
  asyncSep,
  args2arr,
  getArrayFromAsyncIterable,
  asyncIterate,
  assertResemble,
  assertNoSplitter
} from './utils'

describe('with sync iterator and sync separator', () => {
  const get =
    <X> (iter: Iterable<X>, sep: (x: X) => boolean) =>
      getArrayFromAsyncIterable(splitAsyncIterable(iter, sep))

  it('with empty array', async () => {
    expect(await get([], sep)).toEqual([[]])
  })

  describe('with iterable that lacks splitter', () => {
    it('makes exactly one chunk', async () => {
      expect(await get('abcdef', sep)).toHaveProperty('length', 1)
    })

    it('resembles original iterable', async () => {
      assertResemble('abcdef', await get('abcdef', sep))
    })

    it('does not contain splitter elements', async () => {
      assertNoSplitter(await get('abcdef', sep))
    })

    it('matches snapshot', async () => {
      expect(await get('abcdef', sep)).toMatchSnapshot()
    })
  })

  describe('with iterable that has splitters', () => {
    const iterable = args2arr(0, 1, 2, SPLITTER, 3, 4, SPLITTER, 5)

    it('makes multiple chunks', async () => {
      expect(await get(iterable, sep)).toHaveProperty('length', 3)
    })

    it('resembles original iterable', async () => {
      assertResemble(iterable, await get(iterable, sep) as any)
    })

    it('does not contain splitter elements', async () => {
      assertNoSplitter(await get(iterable, sep))
    })

    it('matches snapshot', async () => {
      expect(await get(iterable, sep)).toMatchSnapshot()
    })
  })

  describe('with iterable that has trailing splitters', () => {
    const iterable = args2arr(SPLITTER, 0, 1, 2, SPLITTER, 3, 4, SPLITTER, 5, SPLITTER)

    it('makes multiple chunks', async () => {
      expect(await get(iterable, sep)).toHaveProperty('length', 3 + 2)
    })

    it('first chunk is empty', async () => {
      expect((await get(iterable, sep))[0]).toEqual([])
    })

    it('last chunk is empty', async () => {
      expect((await get(iterable, sep)).slice(-1)[0]).toEqual([])
    })

    it('resembles original iterable', async () => {
      assertResemble(iterable, await get(iterable, sep) as any)
    })

    it('does not contain splitter elements', async () => {
      assertNoSplitter(await get(iterable, sep))
    })

    it('matches snapshot', async () => {
      expect(await get(iterable, sep)).toMatchSnapshot()
    })
  })
})

describe('with async iterator and sync separator', () => {
  const get =
    <X> (iter: Iterable<X>, sep: (x: X) => boolean) =>
      getArrayFromAsyncIterable(splitAsyncIterable(asyncIterate(iter), sep))

  it('with empty array', async () => {
    expect(await get([], sep)).toEqual([[]])
  })

  describe('with iterable that lacks splitter', () => {
    it('makes exactly one chunk', async () => {
      expect(await get('abcdef', sep)).toHaveProperty('length', 1)
    })

    it('resembles original iterable', async () => {
      assertResemble('abcdef', await get('abcdef', sep))
    })

    it('does not contain splitter elements', async () => {
      assertNoSplitter(await get('abcdef', sep))
    })

    it('matches snapshot', async () => {
      expect(await get('abcdef', sep)).toMatchSnapshot()
    })
  })

  describe('with iterable that has splitters', () => {
    const iterable = args2arr(0, 1, 2, SPLITTER, 3, 4, SPLITTER, 5)

    it('makes multiple chunks', async () => {
      expect(await get(iterable, sep)).toHaveProperty('length', 3)
    })

    it('resembles original iterable', async () => {
      assertResemble(iterable, await get(iterable, sep) as any)
    })

    it('does not contain splitter elements', async () => {
      assertNoSplitter(await get(iterable, sep))
    })

    it('matches snapshot', async () => {
      expect(await get(iterable, sep)).toMatchSnapshot()
    })
  })

  describe('with iterable that has trailing splitters', () => {
    const iterable = args2arr(SPLITTER, 0, 1, 2, SPLITTER, 3, 4, SPLITTER, 5, SPLITTER)

    it('makes multiple chunks', async () => {
      expect(await get(iterable, sep)).toHaveProperty('length', 3 + 2)
    })

    it('first chunk is empty', async () => {
      expect((await get(iterable, sep))[0]).toEqual([])
    })

    it('last chunk is empty', async () => {
      expect((await get(iterable, sep)).slice(-1)[0]).toEqual([])
    })

    it('resembles original iterable', async () => {
      assertResemble(iterable, await get(iterable, sep) as any)
    })

    it('does not contain splitter elements', async () => {
      assertNoSplitter(await get(iterable, sep))
    })

    it('matches snapshot', async () => {
      expect(await get(iterable, sep)).toMatchSnapshot()
    })
  })
})

describe('with sync iterator and async separator', () => {
  const get =
    <X> (iter: Iterable<X>, asyncSep: (x: X) => Promise<boolean>) =>
      getArrayFromAsyncIterable(splitAsyncIterable(iter, asyncSep))

  it('with empty array', async () => {
    expect(await get([], asyncSep)).toEqual([[]])
  })

  describe('with iterable that lacks splitter', () => {
    it('makes exactly one chunk', async () => {
      expect(await get('abcdef', asyncSep)).toHaveProperty('length', 1)
    })

    it('resembles original iterable', async () => {
      assertResemble('abcdef', await get('abcdef', asyncSep))
    })

    it('does not contain splitter elements', async () => {
      assertNoSplitter(await get('abcdef', asyncSep))
    })

    it('matches snapshot', async () => {
      expect(await get('abcdef', asyncSep)).toMatchSnapshot()
    })
  })

  describe('with iterable that has splitters', () => {
    const iterable = args2arr(0, 1, 2, SPLITTER, 3, 4, SPLITTER, 5)

    it('makes multiple chunks', async () => {
      expect(await get(iterable, asyncSep)).toHaveProperty('length', 3)
    })

    it('resembles original iterable', async () => {
      assertResemble(iterable, await get(iterable, asyncSep) as any)
    })

    it('does not contain splitter elements', async () => {
      assertNoSplitter(await get(iterable, asyncSep))
    })

    it('matches snapshot', async () => {
      expect(await get(iterable, asyncSep)).toMatchSnapshot()
    })
  })

  describe('with iterable that has trailing splitters', () => {
    const iterable = args2arr(SPLITTER, 0, 1, 2, SPLITTER, 3, 4, SPLITTER, 5, SPLITTER)

    it('makes multiple chunks', async () => {
      expect(await get(iterable, asyncSep)).toHaveProperty('length', 3 + 2)
    })

    it('first chunk is empty', async () => {
      expect((await get(iterable, asyncSep))[0]).toEqual([])
    })

    it('last chunk is empty', async () => {
      expect((await get(iterable, asyncSep)).slice(-1)[0]).toEqual([])
    })

    it('resembles original iterable', async () => {
      assertResemble(iterable, await get(iterable, asyncSep) as any)
    })

    it('does not contain splitter elements', async () => {
      assertNoSplitter(await get(iterable, asyncSep))
    })

    it('matches snapshot', async () => {
      expect(await get(iterable, asyncSep)).toMatchSnapshot()
    })
  })
})

describe('with async iterator and async separator', () => {
  const get =
    <X> (iter: Iterable<X>, asyncSep: (x: X) => Promise<boolean>) =>
      getArrayFromAsyncIterable(splitAsyncIterable(asyncIterate(iter), asyncSep))

  it('with empty array', async () => {
    expect(await get([], asyncSep)).toEqual([[]])
  })

  describe('with iterable that lacks splitter', () => {
    it('makes exactly one chunk', async () => {
      expect(await get('abcdef', asyncSep)).toHaveProperty('length', 1)
    })

    it('resembles original iterable', async () => {
      assertResemble('abcdef', await get('abcdef', asyncSep))
    })

    it('does not contain splitter elements', async () => {
      assertNoSplitter(await get('abcdef', asyncSep))
    })

    it('matches snapshot', async () => {
      expect(await get('abcdef', asyncSep)).toMatchSnapshot()
    })
  })

  describe('with iterable that has splitters', () => {
    const iterable = args2arr(0, 1, 2, SPLITTER, 3, 4, SPLITTER, 5)

    it('makes multiple chunks', async () => {
      expect(await get(iterable, asyncSep)).toHaveProperty('length', 3)
    })

    it('resembles original iterable', async () => {
      assertResemble(iterable, await get(iterable, asyncSep) as any)
    })

    it('does not contain splitter elements', async () => {
      assertNoSplitter(await get(iterable, asyncSep))
    })

    it('matches snapshot', async () => {
      expect(await get(iterable, asyncSep)).toMatchSnapshot()
    })
  })

  describe('with iterable that has trailing splitters', () => {
    const iterable = args2arr(SPLITTER, 0, 1, 2, SPLITTER, 3, 4, SPLITTER, 5, SPLITTER)

    it('makes multiple chunks', async () => {
      expect(await get(iterable, asyncSep)).toHaveProperty('length', 3 + 2)
    })

    it('first chunk is empty', async () => {
      expect((await get(iterable, asyncSep))[0]).toEqual([])
    })

    it('last chunk is empty', async () => {
      expect((await get(iterable, asyncSep)).slice(-1)[0]).toEqual([])
    })

    it('resembles original iterable', async () => {
      assertResemble(iterable, await get(iterable, asyncSep) as any)
    })

    it('does not contain splitter elements', async () => {
      assertNoSplitter(await get(iterable, asyncSep))
    })

    it('matches snapshot', async () => {
      expect(await get(iterable, asyncSep)).toMatchSnapshot()
    })
  })
})
