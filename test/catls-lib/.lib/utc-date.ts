export class UTCDate extends Date {
  constructor (
    year: number,
    month: number,
    date: number,
    hours: number = 0,
    minutes: number = 0,
    seconds: number = 0,
    milliseconds: number = 0
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

export default UTCDate
