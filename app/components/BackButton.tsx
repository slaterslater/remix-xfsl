import { Link } from '@remix-run/react'
import { BiChevronsLeft } from 'react-icons/bi'

export default function BackButton({ to }) {
  return (
    <Link id="back" to={to}>
      <BiChevronsLeft />
      Back
    </Link>
  )
}
