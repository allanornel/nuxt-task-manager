import type { H3Event } from 'h3';
import { getCookie } from 'h3'
import { getUserIdFromSession, getUsers } from '../../db/index'
import type { User } from '../../types/auth'

export default defineEventHandler(async (event: H3Event) => {
  const token = getCookie(event, 'session') as string | undefined
  if (!token) return { user: null }
  const userId = await getUserIdFromSession(token, true)
  if (!userId) return { user: null }
  const users = await getUsers()
  const user = users.find((u: User) => u.id === userId)
  if (!user) return { user: null }
  return { user: { id: user.id, email: user.email, name: user.name } }
})
