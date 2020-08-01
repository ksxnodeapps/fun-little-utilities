import { spawn } from 'child_process'
import * as assets from 'monorepo-shared-assets'
import { iterateEventedStream, EventedStream } from 'evented-stream'
import getAsyncArray = assets.asyncIter.fns.getArray
const executable = require.resolve('./.data/executable')

const spawnExecutable = () => spawn(executable) as any // quick fix

const getAsyncString = async (stream: EventedStream<Buffer>) =>
  (await getAsyncArray(iterateEventedStream(stream)))
    .map(chunk => chunk.toString()).join('')

it('with ChildProcess::stdout', async () => {
  expect(
    await getAsyncString(spawnExecutable().stdout),
  ).toEqual([
    'stdout 0\n',
    'stdout 1\n',
    'stdout 2\n',
  ].join(''))
})

it('with ChildProcess::stderr', async () => {
  expect(
    await getAsyncString(spawnExecutable().stderr),
  ).toEqual([
    'stderr 0\n',
    'stderr 1\n',
    'stderr 2\n',
  ].join(''))
})
