function addDays(date: Date, amount: number): Date {
  return new Date(date.getTime() + 24 * 60 * 60 * 1000 * amount)
}

export default addDays
