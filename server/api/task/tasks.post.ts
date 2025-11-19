import type { H3Event } from 'h3'
import { getCookie, readBody, sendError, createError } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
    const { addTask, getUserIdFromSession } = await import('../../db/index')

    const token = getCookie(event, 'session') as string | undefined
    const userId = await getUserIdFromSession(token, true)
    if (!userId) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    const body = (await readBody(event)) as Record<string, unknown> | null
    const title = (body?.title ?? '') as string
    const description = body?.description ? String(body.description) : undefined

    if (!title || !title.trim()) {
        throw createError({ statusCode: 400, statusMessage: 'Title is required' })
    }

    const task = await addTask({ title: title.trim(), description }, userId)
    return { status: 201, task }
})
