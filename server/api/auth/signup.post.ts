import type { H3Event } from 'h3';
import { readBody, setCookie, createError } from 'h3'
import crypto from 'node:crypto'
import { findUserByEmail, hashPassword, addUser, createSession } from '../../db/index'
import type { User } from '../../types/auth'

function validateEmail(email: unknown): email is string {
  return typeof email === 'string' && /\S+@\S+\.\S+/.test(email)
}

function validatePassword(p: unknown): p is string {
  return typeof p === 'string' && p.length >= 6
}

export default defineEventHandler(async (event: H3Event) => {
  const body = (await readBody(event)) as unknown
  const payload = (body ?? {}) as Record<string, unknown>
  const email = payload.email
  const name = payload.name
  const password = payload.password

  if (!email || !name || !password) throw createError({ statusCode: 400, statusMessage: 'Missing required fields: name, email, password' })
  if (!validateEmail(email)) throw createError({ statusCode: 400, statusMessage: 'Invalid email format' })
  if (!validatePassword(password)) throw createError({ statusCode: 400, statusMessage: 'Password must be at least 6 characters' })

  const existing = await findUserByEmail(email)
  if (existing) throw createError({ statusCode: 409, statusMessage: 'Email already in use' })

  const id = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex')
  const hashed = await hashPassword(password)
  const user: User = {
    id,
    email,
    name: String(name),
    password: hashed,
    createdAt: new Date().toISOString()
  }

  await addUser(user)
  const { token, expiresAt } = await createSession(user.id)
  // set cookie maxAge to session TTL (in seconds)
  const maxAge = Math.max(0, Math.floor((Date.parse(expiresAt) - Date.now()) / 1000))
  setCookie(event, 'session', token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge })
  return { ok: true, user: { id: user.id, email: user.email, name: user.name } }
})
