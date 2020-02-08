import yargs from 'yargs'
import fetch from 'node-fetch'
import console from 'console'
import process from 'process'
import { NPM_REGISTRY, main } from '../index'

const { argv } = yargs
  .usage('$0 [names]')
  .option('registry', {
    alias: 'r',
    describe: 'Configure registry',
    type: 'string',
    default: NPM_REGISTRY
  })
  .example('$0 foo bar', 'Supply package names via CLI arguments')
  .example('$0 < packages.txt', 'Supply package names via a text file where each line is a package name')
  .example('$0', 'Supply package names by entering each one via terminal')
  .env('AVAILABLE_NPM_NAME')
  .help()

main({
  argv,
  fetch,
  console,
  process
})
  .then(status => process.exit(status))
  .catch(error => {
    console.error(error)
    return process.exit(-1)
  })
