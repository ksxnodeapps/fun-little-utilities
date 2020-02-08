import delay from 'simple-delay'
import { NPM_REGISTRY, Fetch, sequence } from 'available-npm-name'

async function getAsyncArray<Item> (iterable: AsyncIterable<Item>) {
  const array: Item[] = []
  for await (const item of iterable) {
    array.push(item)
  }
  return array
}

describe('when fetch causes errors', () => {
  async function setup () {
    const expectedError = Symbol('expectedError')
    const fetch: Fetch.Fn = async url => {
      await delay(10)
      if (url.includes('ERROR')) throw expectedError
      return { status: 404 }
    }
    const promise = getAsyncArray(sequence({
      fetch,
      packageNames: ['abc', 'def', 'ERROR1', 'ghi', 'ERROR2', 'jkl'],
      registryUrl: NPM_REGISTRY
    }))
    const receivedError = await promise.catch(error => error)
    return { expectedError, promise, receivedError }
  }

  it('rejects', async () => {
    const { expectedError, promise } = await setup()
    await expect(promise).rejects.toBe(expectedError)
  })
})
