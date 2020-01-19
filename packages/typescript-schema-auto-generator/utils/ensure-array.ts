export const ensureArray =
  <Item> (value: Item | readonly Item[]): Item[] =>
    Array.isArray(value) ? [...value] : [value]

export default ensureArray
