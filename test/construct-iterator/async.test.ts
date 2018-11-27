import {
  createAsyncIterableIterator,
  createAsyncIteratorResult,
  IteratorResultLike,
  IteratorResultInstance
} from 'construct-iterator'

describe('deals with async next()', () => {
  const mknext = (max: number) => {
    let index = 0

    const next = async (): Promise<IteratorResultLike<number>> => {
      if (index >= max) return { done: true }
      const value = index
      index += 1
      return { value }
    }

    return next
  }

  describe('createAsyncIterableIterator()', () => {
    const create = () => createAsyncIterableIterator(mknext(5))

    it('is iterable', async () => {
      for await (const x of create()) {
        expect(typeof x).toBe('number')
      }
    })

    it('is an iterator', async () => {
      const iterator = create()
      const promiseCollection = Array<Promise<IteratorResultInstance<number>>>()
      const resultCollection = Array<IteratorResultInstance<number>>()

      for (;;) {
        const promise = iterator.next()
        promiseCollection.push(promise)
        expect(promise).toBeInstanceOf(Promise)

        const result = await promise
        resultCollection.push(result)
        expect(result).toBeInstanceOf(IteratorResultInstance)

        if (result.done) break
      }

      expect(resultCollection).toMatchSnapshot()
    })
  })

  describe('createIteratorResult()', () => {
    it('when done is not provided', async () => {
      const param = { value: 123 }
      const expected = { value: 123, done: false }
      expect(await createAsyncIteratorResult(param)).toEqual(expected)
    })

    it('when done is false', async () => {
      const param = { done: false as false, value: 123 }
      expect(await createAsyncIteratorResult(param)).toEqual(param)
    })

    it('when done is true', async () => {
      const param = { done: true as true }
      const expected = { done: true, value: undefined }
      const result = await createAsyncIteratorResult(param)
      expect(result).toEqual(expected)
      expect(result).toHaveProperty('value')
      expect(result.value).toBe(undefined)
    })
  })
})

describe('deals with sync next()', () => {
  const mknext = (max: number) => {
    let index = 0

    const next = (): IteratorResultLike<number> => {
      if (index >= max) return { done: true }
      const value = index
      index += 1
      return { value }
    }

    return next
  }

  describe('createAsyncIterableIterator()', () => {
    const create = () => createAsyncIterableIterator(mknext(5))

    it('is iterable', async () => {
      for await (const x of create()) {
        expect(typeof x).toBe('number')
      }
    })

    it('is an iterator', async () => {
      const iterator = create()
      const promiseCollection = Array<Promise<IteratorResultInstance<number>>>()
      const resultCollection = Array<IteratorResultInstance<number>>()

      for (;;) {
        const promise = iterator.next()
        promiseCollection.push(promise)
        expect(promise).toBeInstanceOf(Promise)

        const result = await promise
        resultCollection.push(result)
        expect(result).toBeInstanceOf(IteratorResultInstance)

        if (result.done) break
      }

      expect(resultCollection).toMatchSnapshot()
    })
  })

  describe('createIteratorResult()', () => {
    it('when done is not provided', async () => {
      const param = { value: 123 }
      const expected = { value: 123, done: false }
      expect(await createAsyncIteratorResult(param)).toEqual(expected)
    })

    it('when done is false', async () => {
      const param = { done: false as false, value: 123 }
      expect(await createAsyncIteratorResult(param)).toEqual(param)
    })

    it('when done is true', async () => {
      const param = { done: true as true }
      const expected = { done: true, value: undefined }
      const result = await createAsyncIteratorResult(param)
      expect(result).toEqual(expected)
      expect(result).toHaveProperty('value')
      expect(result.value).toBe(undefined)
    })
  })
})
