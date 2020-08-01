import {
  createIterableIterator,
  createIteratorResult,
  IteratorResultLike,
  IteratorResultInstance,
} from 'construct-iterator'

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

describe('createIterableIterator()', () => {
  const create = () => createIterableIterator(mknext(5))

  it('is iterable', () => {
    for (const x of create()) {
      expect(typeof x).toBe('number')
    }
  })

  it('is covertible to array', () => {
    expect(Array.from(create())).toEqual([0, 1, 2, 3, 4])
  })

  it('is an iterator', () => {
    const iterator = create()
    const collection = Array<IteratorResultInstance<number>>()

    for (;;) {
      const result = iterator.next()
      collection.push(result)
      expect(result).toBeInstanceOf(IteratorResultInstance)
      if (result.done) break
    }

    expect(collection).toMatchSnapshot()
  })
})

describe('createIteratorResult()', () => {
  it('when done is not provided', () => {
    const param = { value: 123 }
    const expected = { value: 123, done: false }
    expect(createIteratorResult(param)).toEqual(expected)
  })

  it('when done is false', () => {
    const param = { done: false as false, value: 123 }
    expect(createIteratorResult(param)).toEqual(param)
  })

  it('when done is true', () => {
    const param = { done: true as true }
    const expected = { done: true, value: undefined }
    const result = createIteratorResult(param)
    expect(result).toEqual(expected)
    expect(result).toHaveProperty('value')
    expect(result.value).toBe(undefined)
  })
})
