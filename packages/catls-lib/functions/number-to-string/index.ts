const INF_STR = ['inf', 'infinity', '∞', 'all', 'yes', 'true']

function numberToString (value: string): number {
  return INF_STR.includes(value)
    ? Infinity
    : Math.max(0, parseInt(value, 10))
}

export = numberToString