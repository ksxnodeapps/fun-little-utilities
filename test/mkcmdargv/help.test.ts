import { help } from 'mkcmdargv'

it('matches snapshot', async () => {
  expect('\n' + await help()).toMatchSnapshot()
})
