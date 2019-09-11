import DEFAULT, { createPrettyExec } from 'pretty-exec'

it('exports createPrettyExec as default', () => {
  expect(createPrettyExec).toBe(DEFAULT)
})
