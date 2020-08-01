import sort from 'sort-versions'

it('matches snapshot', () => {
  const input = [
    '3.1.0',
    'v3.0.2',
    'invalid 0',
    '2.0.1',
    'v1.0.0',
    'invalid 1',
    '1.0.1',
    '0.1.2',
    'v0.0.0',
  ]

  expect(sort(input)).toMatchSnapshot()
})
