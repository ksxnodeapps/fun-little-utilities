import { zipAll } from 'iter-tools'
import AdvMapInit from 'advanced-map-initialized'

export class CellSet<Title extends string, Value> {
  constructor (
    public readonly headers: readonly Title[],
    public readonly rows: Iterable<readonly Value[]>
  ) {}
}

export type ListItem<Key extends string, Value> = {
  readonly [_ in Key | symbol]: Value | undefined
}

class UnknownColumns extends AdvMapInit<number, symbol> {
  constructor () {
    super(Map, index => Symbol('Unknown Column #' + index))
  }
}

const UNKNOWN_COLUMNS = new UnknownColumns()
export const unknownColumn = (index: number) => UNKNOWN_COLUMNS.get(index)

export class List<Title extends string, Value> implements Iterable<ListItem<Title, Value>> {
  constructor (
    private readonly cells: CellSet<Title, Value>
  ) {}

  public * [Symbol.iterator] () {
    const { headers, rows } = this.cells

    for (const row of rows) {
      const item: ListItem<Title, Value> = {} as any
      let index = 0

      for (const [key, value] of zipAll<any>(headers, row)) {
        (item as any)[key ? key : unknownColumn(index)] = value
        index += 1
      }

      yield item
    }
  }
}
