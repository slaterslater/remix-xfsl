import { Link } from '@remix-run/react'

export default function Header() {
  return (
    <header>
      <Link to="/">
        <h1 className="offscreen">Xtremely Friendly Softball League</h1>
      </Link>
      <nav>
        <ul>
          <li>
            <Link className="heading-font" to="/">
              This Week
            </Link>
          </li>
          <li>
            <Link to="/">
              <img src="/xfsl-logo.png" width={80} height={40} alt="xfsl logo" />
            </Link>
          </li>
          <li>
            <Link className="heading-font" to="/schedule">
              Schedule
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
