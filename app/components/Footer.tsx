import { Link } from '@remix-run/react'
import dayjs from 'dayjs'

export default function Footer() {
  const year = dayjs().year()
  return (
    <footer>
      <p>
        <Link to="/admin">Xtremely Friendly Softball League {year}</Link>
      </p>
    </footer>
  )
}
