import spawn from 'advanced-spawn-async'

export async function notifySend(options: ExecOptions) {
  const { command = 'notify-send', execute = spawn } = options
  const args = opts2args(options)
  await execute(command, args).onclose
}

export function opts2args(options: Options) {
  const {
    summary,
    body,
    appName,
    icon,
    urgency,
    expireTime,
    category,
    hint,
  } = options

  let args = Array<string>()
  if (appName) args.push(`--app-name=${appName}`)
  if (icon) args.push(`--icon=${icon.join(',')}`)
  if (urgency) args.push(`--urgency=${urgency}`)
  if (expireTime) args.push(`--expire-time=${expireTime}`)
  if (category) args.push(`--category=${category.join(',')}`)
  if (hint) args.push(`--hint=${hint2str(hint)}`)
  args.push('--', summary)
  if (body) args.push(body)

  return args
}

export function hint2str(hint: Hint) {
  return hint.type + ':' + hint.name + ':' + hint.value
}

export interface ExecOptions extends Options {
  readonly command?: string
  readonly execute?: ExecFunc
}

export interface ExecFunc {
  (command: string, args: ReadonlyArray<string>): ExecReturn
}

export interface ExecReturn {
  readonly onclose?: Promise<void>
}

export interface Options {
  readonly summary: string
  readonly body?: string
  readonly appName?: string
  readonly icon?: ReadonlyArray<string>
  readonly urgency?: Urgency
  readonly expireTime?: number
  readonly category?: ReadonlyArray<string>
  readonly hint?: Hint
}

export const enum Urgency {
  Low = 'low',
  Normal = 'normal',
  Critical = 'critical',
}

export type Hint = StringHint | NumberHint

interface HintBase {
  readonly type: HintType
  readonly name: string
  readonly value: number | string
}

interface StringHint extends HintBase {
  readonly type: HintType.String
  readonly value: string
}

interface NumberHint extends HintBase {
  readonly type: HintType.Int | HintType.Double | HintType.Byte
  readonly value: number
}

export const enum HintType {
  Int = 'int',
  Double = 'double',
  String = 'string',
  Byte = 'byte',
}

export default notifySend
