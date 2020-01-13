#! /usr/bin/env node
const console = require('console')
const process = require('process')

const text = `
  | id | name        | email                    |
  |----|-------------|--------------------------|
  |  1 | John Doe    | john-doe@gmail.com       |
  |  2 | Peter Smith | petersmith22@outlook.com |
  |  3 | Julia Jones | jjones778@gmail.com      |
`

/**
 * Wait for a time
 * @param {number} ms Milliseconds
 * @returns {Promise.<void>}
 */
const sleep = ms => new Promise(resolve => setTimeout(() => resolve(), ms))

async function main () {
  for (const line of text.split('\n')) {
    console.info(line)
    await sleep(1024)
  }
}

main().catch(error => {
  console.error(error)
  return process.exit(-1)
})
