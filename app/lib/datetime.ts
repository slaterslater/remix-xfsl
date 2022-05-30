import dayjs from 'dayjs'

const token = 'MMMM D'

export function dateFormat(date: Date | undefined) {
  return dayjs(date).format(token)
}

export function timeFormat(time: Date | undefined) {
  return dayjs(time).format('hmm')
}

export function gameDayFormat() {
  return dayjs().day(4).format(token)
}
