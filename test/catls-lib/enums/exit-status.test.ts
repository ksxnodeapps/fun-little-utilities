import { ExitStatus } from 'catls-lib'

it('matches snapshot', () => {
  expect(ExitStatus).toMatchSnapshot()
})
