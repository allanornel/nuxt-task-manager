import type { H3Event } from 'h3'
import { getCookie, readBody, createError } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
    const { getUserIdFromSession, getTasksByUser, updateTask } = await import('../../db/index')
    const token = getCookie(event, 'session') as string | undefined

    const userId = await getUserIdFromSession(token, true)
    if (!userId) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    const body = (await readBody(event)) as Record<string, unknown> | null
    const id = body?.id as string | undefined
    const completed = typeof body?.completed === 'boolean' ? (body!.completed as boolean) : undefined

    if (!id) throw createError({ statusCode: 400, statusMessage: 'Task id is required' })
    if (completed === undefined) throw createError({ statusCode: 400, statusMessage: 'Completed value is required' })

    const tasks = await getTasksByUser(userId)
    const task = tasks.find((t: any) => t.id === id)
    if (!task) throw createError({ statusCode: 404, statusMessage: 'Task not found' })

    const updatedTask = { ...task, completed, updatedAt: new Date().toISOString() }
    await updateTask(updatedTask)

    return { status: 200, task: updatedTask }
})
