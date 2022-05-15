import type { ActionFunction, LinksFunction } from '@remix-run/node'
import { redirect, json } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { createUserSession, login } from '~/utils/session.server'

import loginStyles from '~/styles/login.css'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: loginStyles }]

function validateUsername(username: unknown) {
  if (typeof username !== 'string' || username.length < 3) {
    return `Usernames must be at least 3 characters long`
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== 'string' || password.length < 6) {
    return `Passwords must be at least 6 characters long`
  }
}

type ActionData = {
  formError?: string
  fieldErrors?: {
    username: string | undefined
    password: string | undefined
  }
  fields?: {
    username: string
    password: string
  }
}

const badRequest = (data: ActionData) => json(data, { status: 400 })

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const username = form.get('username')
  const password = form.get('password')

  if (typeof username !== 'string' || typeof password !== 'string') {
    return badRequest({
      formError: `Form not submitted correctly.`,
    })
  }

  const fields = { username, password }
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  }
  if (Object.values(fieldErrors).some(Boolean)) return badRequest({ fieldErrors, fields })

  // const user = null
  const user = await login({ username, password })
  if (!user) {
    return badRequest({
      fields,
      formError: `Username/Password combination is incorrect`,
    })
  }
  return createUserSession(user.id)
}

export default function Login() {
  const actionData = useActionData<ActionData>()
  return (
    <main>
      <h2>Login</h2>
      <Form method="post">
        <div>
          <label htmlFor="username-input">Username</label>
          <input
            type="text"
            id="username-input"
            name="username"
            aria-invalid={Boolean(actionData?.fieldErrors?.username)}
            aria-errormessage={actionData?.fieldErrors?.username ? 'username-error' : undefined}
          />
          {actionData?.fieldErrors?.username && (
            <p className="form-validation-error" role="alert" id="username-error">
              {actionData.fieldErrors.username}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="password-input">Password</label>
          <input
            id="password-input"
            name="password"
            defaultValue={actionData?.fields?.password}
            type="password"
            aria-invalid={Boolean(actionData?.fieldErrors?.password) || undefined}
            aria-errormessage={actionData?.fieldErrors?.password ? 'password-error' : undefined}
          />
          {actionData?.fieldErrors?.password && (
            <p className="form-validation-error" role="alert" id="password-error">
              {actionData.fieldErrors.password}
            </p>
          )}
        </div>
        <div id="form-error-message">
          {actionData?.formError && (
            <p className="form-validation-error" role="alert">
              {actionData.formError}
            </p>
          )}
        </div>
        <button type="submit" className="button">
          Submit
        </button>
      </Form>
    </main>
  )
}
