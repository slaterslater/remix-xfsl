import dayjs from 'dayjs'

export function dateFormat(date: Date | undefined) {
  return dayjs(date).format('MMM D')
}

export function timeFormat(time: Date | undefined) {
  return dayjs(time).format('hmm')
}

export function gameDayFormat() {
  return dayjs().day(4).format('MMM D')
}
