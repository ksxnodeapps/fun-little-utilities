import { partition } from 'ramda'
import { splitIterable } from 'split-iterable'

type Value = string | number | boolean

type Options = {
  readonly [name in string]: Value
}

export interface Param {
  readonly args?: readonly string[]
  readonly options?: Options
  readonly flags?: readonly string[]
}

function parseSingleDash ([key, value]: [string, Value]) {
  const optName = '-' + key
  if (value === true) return [optName]
  if (value === false) return []
  return [optName, String(value)]
}

function parseDoubleDash ([key, value]: [string, Value]) {
  const optName = '--' + key
  if (value === true) return [optName]
  if (value === false) return []
  return [`${optName}=${value}`]
}

export function * iterateCommandArguments (param: Param) {
  const { args = [], options = {}, flags = [] } = param
  const [beforeDoubleDashes, ...afterDoubleDashes] = splitIterable(args, x => x === '--')
  const [beforeDashes, afterDashes] = partition(x => x[0] !== '-', beforeDoubleDashes)
  const optionsPairs = Object.entries(options)
  const [singleDashOptions, doubleDashOptions] = partition(([key]) => key.length === 1, optionsPairs)
  const [singleDashFlags, doubleDashFlags] = partition(x => x.length === 1, flags)

  yield * beforeDashes

  if (singleDashFlags.length) yield '-' + singleDashFlags.join('')

  for (const entry of singleDashOptions) {
    yield * parseSingleDash(entry)
  }

  yield * doubleDashFlags.map(x => '--' + x)

  for (const entry of doubleDashOptions) {
    yield * parseDoubleDash(entry)
  }

  if (!afterDashes.length && !afterDoubleDashes.length) return

  yield '--'
  yield * afterDashes

  for (const chunk of afterDoubleDashes) {
    yield '--'
    yield * chunk
  }
}

export function createCommandArguments (param: Param) {
  return Array.from(iterateCommandArguments(param))
}

export async function help () {
  const pathPromise = import('path')
  const fsxPromise = import('fs-extra')
  const path = await pathPromise
  const helpFilePath = path.resolve(__dirname, '../data/help.txt')
  const { readFile } = await fsxPromise
  return readFile(helpFilePath, { encoding: 'utf8' })
}
