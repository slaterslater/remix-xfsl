import { createCookieSessionStorage, redirect } from '@remix-run/node'
import bcrypt from 'bcryptjs'

import { db } from './db.server'

type LoginForm = {
  username: string
  password: string
}

export async function login({ username, password }: LoginForm) {
  const user = await db.user.findUnique({
    where: { username },
  })
  if (!user) return null

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash)
  if (!isCorrectPassword) return null

  return { id: user.id, username }
}

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set')
}

const storage = createCookieSessionStorage({
  cookie: {
    name: 'XFSL_session',
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: true,
    // secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
})

export async function createUserSession(userId: string) {
  const session = await storage.getSession()
  session.set('userId', userId)
  return redirect('/', {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  })
}