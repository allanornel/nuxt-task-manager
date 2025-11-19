import type { H3Event } from 'h3';
import { getCookie, setCookie } from 'h3'
import { deleteSession } from '../../db/index'

export default defineEventHandler(async (event: H3Event) => {
  const token = getCookie(event, 'session') as string | undefined
  if (token) await deleteSession(token)
  // clear cookie
  setCookie(event, 'session', '', { path: '/', maxAge: 0 })
  return { ok: true }
})
