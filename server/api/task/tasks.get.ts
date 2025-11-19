import { getTasksByUser } from '~~/server/db'
import type { H3Event } from 'h3';
import { getCookie } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
    const { getUserIdFromSession } = await import('../../db/index')
    const token = getCookie(event, 'session') as string | undefined
    const userId = await getUserIdFromSession(token, true)
    if (!userId) return { tasks: [] }

    const tasks = await getTasksByUser(userId)
    return { tasks }
})