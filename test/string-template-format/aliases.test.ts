it('inspect = formatInspector', async () => {
  const { inspect, formatInspector } = await import('string-template-format')
  expect(inspect).toBe(formatInspector)
})

it('dbg = formatInspector', async () => {
  const { dbg, formatInspector } = await import('string-template-format')
  expect(dbg).toBe(formatInspector)
})

it('json = formatJson', async () => {
  const { json, formatJson } = await import('string-template-format')
  expect(json).toBe(formatJson)
})

it('toString = formatToString', async () => {
  const { toString, formatToString } = await import('string-template-format')
  expect(toString).toBe(formatToString)
})

it('str = formatToString', async () => {
  const { str, formatToString } = await import('string-template-format')
  expect(str).toBe(formatToString)
})

it('uri = formatUri', async () => {
  const { uri, formatUri } = await import('string-template-format')
  expect(uri).toBe(formatUri)
})

it('uriComp = formatUriComponent', async () => {
  const { uriComp, formatUriComponent } = await import('string-template-format')
  expect(uriComp).toBe(formatUriComponent)
})
