import dayjs from 'dayjs'

export function convertExpiredAtTextToDate(text: string): Date {
  const dateAsFrStringMatches = /(\d{2})\/(\d{2})\/(\d{4})/.exec(text)
  if (dateAsFrStringMatches === null || dateAsFrStringMatches.length !== 4) {
    return dayjs().add(2, 'months').startOf('day').toDate()
  }

  const [, dd, mm, yyyy] = dateAsFrStringMatches
  const date = dayjs(`${yyyy}-${mm}-${dd}`).startOf('day').toDate()

  return date
}
