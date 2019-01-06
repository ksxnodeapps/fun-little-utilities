class UTCDate extends Date {
  constructor (
    year: number,
    month: number,
    date: number,
    hours?: number,
    minutes?: number,
    seconds?: number,
    milliseconds?: number
  ) {
    super(Date.UTC(
      year,
      month,
      date,
      hours,
      minutes,
      seconds,
      milliseconds
    ))
  }
}

export = UTCDate
