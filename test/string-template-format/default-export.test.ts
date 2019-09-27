import DEFAULT, { TemplateTag, tag } from 'string-template-format'

it('default export is TemplateTag', () => {
  expect(DEFAULT).toBe(TemplateTag)
})

it('default export is tag', () => {
  expect(DEFAULT).toBe(tag)
})
