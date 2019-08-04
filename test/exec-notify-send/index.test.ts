import fsx from 'fs-extra'
import temp from 'unique-temp-path'

import defaultExport, {
  notifySend,
  ExecFunc,
  Urgency,
  HintType
} from 'exec-notify-send'

const mockedExecute = (fn: ExecFunc = () => ({})) => jest.fn(fn)

it('export default notifySend', () => {
  expect(defaultExport).toBe(notifySend)
})

it('default command is "notify-send"', async () => {
  expect.assertions(1)

  const execute: ExecFunc = command => {
    expect(command).toBe('notify-send')
    return {}
  }

  await notifySend({
    summary: 'summary',
    execute
  })
})

it('default execute function works', async () => {
  const script = temp('test-exec-notify-send.script.', '.js')
  const output = temp('test-exec-notify-send.output.', '.txt')

  const scriptContent = `
    #! /usr/bin/env node
    const process = require('process')
    const fs = require('fs')
    const text = process.argv.slice(2).join(' ')
    fs.writeFileSync(${JSON.stringify(output)}, text)
    process.exit(0)
  `
    .split(/\n|\r/)
    .map(line => line.trim())
    .filter(Boolean)
    .join('\n')

  await fsx.writeFile(script, scriptContent)
  await fsx.chmod(script, '755')

  await notifySend({
    command: script,
    summary: 'summary',
    body: 'body',
    appName: 'app-name',
    icon: ['32x', '16x', '8x'],
    expireTime: 123
  })

  expect(await fsx.readFile(output, 'utf8')).toMatchSnapshot()
})

it('summary only', async () => {
  const execute = mockedExecute()
  await notifySend({
    summary: 'summary',
    execute
  })
  expect(execute.mock.calls).toMatchSnapshot()
})

it('summary and body', async () => {
  const execute = mockedExecute()
  await notifySend({
    summary: 'summary',
    body: 'body',
    execute
  })
  expect(execute.mock.calls).toMatchSnapshot()
})

it('more options', async () => {
  const execute = mockedExecute()
  await notifySend({
    summary: 'summary',
    body: 'body',
    appName: 'Application Name',
    icon: ['x64', 'x32', 'x16', 'x8'],
    category: ['test', 'category'],
    expireTime: 123,
    urgency: Urgency.Critical,
    hint: { name: 'hint', type: HintType.Int, value: 35 },
    execute
  })
  expect(execute.mock.calls).toMatchSnapshot()
})
