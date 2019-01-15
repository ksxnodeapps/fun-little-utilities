import { SymlinkResolution } from 'catls-lib'

it('matches snapshot', () => {
  expect(SymlinkResolution).toMatchSnapshot()
})
