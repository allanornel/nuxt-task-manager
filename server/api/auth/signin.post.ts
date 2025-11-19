import type { H3Event } from 'h3';
import { readBody, setCookie, createError } from 'h3'
import { findUserByEmail, comparePassword, createSession } from '../../db/index'

function validateEmail(email: unknown): email is string {
  return typeof email === 'string' && /\S+@\S+\.\S+/.test(email)
}

export default defineEventHandler(async (event: H3Event) => {
  const body = (await readBody(event)) as unknown
  const payload = (body ?? {}) as Record<string, unknown>
  const email = payload.email
  const password = payload.password
  if (!email || !password) throw createError({ statusCode: 400, statusMessage: 'Missing fields' })
  if (!validateEmail(email)) throw createError({ statusCode: 400, statusMessage: 'Invalid email format' })
  const user = await findUserByEmail(email)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  const ok = await comparePassword(String(password), user.password)
  if (!ok) throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })

  const { token, expiresAt } = await createSession(user.id)
  const maxAge = Math.max(0, Math.floor((Date.parse(expiresAt) - Date.now()) / 1000))
  setCookie(event, 'session', token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge })
  return { ok: true, user: { id: user.id, email: user.email, name: user.name } }
})
