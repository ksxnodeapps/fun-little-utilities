import { zipAll } from 'iter-tools'
import AdvMapInit from 'advanced-map-initialized'

type MaybeAsyncIterable<X> = Iterable<X> | AsyncIterable<X>

export interface ArrayTable<Title extends string, Value> {
  readonly headers: readonly Title[]
  readonly rows: MaybeAsyncIterable<readonly Value[]>
}

export type ListItem<Key extends string, Value> = {
  readonly [_ in Key | symbol]: Value | undefined
}

class UnknownColumns extends AdvMapInit<number, symbol> {
  constructor () {
    super(Map, index => Symbol('Unknown Column #' + index))
  }
}

export interface ObjectTable<Title extends string, Value>
extends AsyncIterable<ListItem<Title, Value>> {}

async function getArrayList<Title extends string, Value> (table: ObjectTable<Title, Value>) {
  const headers = Array<Title>()
  const rows = Array<Value[]>()

  // tslint:disable-next-line:await-promise
  for await (const item of table) {
    const currentRow = Array<Value>()

    for (const [key, value] of Object.entries(item) as [Title, Value][]) {
      const index = headers.includes(key)
        ? headers.indexOf(key)
        : (headers.push(key) - 1)

      currentRow[index] = value
    }

    rows.push(currentRow)
  }

  return { headers, rows }
}

async function * getObjectList<Title extends string, Value> (table: ArrayTable<Title, Value>) {
  const { headers, rows } = table

  for await (const row of rows) {
    const item: ListItem<Title, Value> = {} as any
    let index = 0

    for (const [key, value] of zipAll<any>(headers, row)) {
      (item as any)[key ? key : unknownColumn(index)] = value
      index += 1
    }

    yield item
  }
}

export async function createArrayTable<Title extends string, Value> (objectTable: ObjectTable<Title, Value>): Promise<ArrayTable<Title, Value>> {
  const { headers, rows } = await getArrayList(objectTable)
  return new class implements ArrayTable<Title, Value> {
    public readonly headers = headers
    public readonly rows = rows
  }()
}

const UNKNOWN_COLUMNS = new UnknownColumns()
export const unknownColumn = (index: number) => UNKNOWN_COLUMNS.get(index)

export function createObjectTable<Title extends string, Value> (arrayTable: ArrayTable<Title, Value>): ObjectTable<Title, Value> {
  return new class implements ObjectTable<Title, Value> {
    public readonly [Symbol.asyncIterator] = () => getObjectList(arrayTable)
  }()
}
