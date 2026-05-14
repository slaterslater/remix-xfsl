'use strict'

const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const filename = 'XFSL-2025-Schedule-and-Rules.pdf'
const src = path.join(root, 'assets', filename)
const dest = path.join(root, 'public', filename)
const publicDir = path.join(root, 'public')

if (!fs.existsSync(src)) {
  if (fs.existsSync(dest)) {
    fs.unlinkSync(dest)
    console.warn(
      `[copy-schedule-pdf] Removed stale public/${filename} (source missing).`,
    )
  } else {
    console.warn(
      `[copy-schedule-pdf] Missing assets/${filename} — nothing copied. ` +
        `Add the file there to serve it at /${filename}.`,
    )
  }
  process.exit(0)
}

fs.mkdirSync(publicDir, { recursive: true })
fs.copyFileSync(src, dest)
console.log(`[copy-schedule-pdf] Copied to public/${filename}`)
