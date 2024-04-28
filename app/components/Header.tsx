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
            {/* <Link className="heading-font" to="/">
              This Week
            </Link> */}
            <Link className="heading-font" to="/schedule">
              Schedule
            </Link>
          </li>
          <li>
            <Link to="/">
              <img src="/xfsl-logo.png" width={60} height={30} alt="xfsl logo" />
            </Link>
          </li>
          <li>
            <a href="/XFSL-2024-Schedule-and-Rules.pdf" target="_blank">
              Rules
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
