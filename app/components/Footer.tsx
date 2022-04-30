import dayjs from 'dayjs'

export default function Footer() {
  const year = dayjs().year()
  return (
    <footer>
      <p>Xtremely Friendly Softball League {year}</p>
    </footer>
  )
}
