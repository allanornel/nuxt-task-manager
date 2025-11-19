export default defineEventHandler(async (event: H3Event) => {
    const { addTask } = await import('../../db/index')
    const body = await readBody(event) as unknown
    const payload = (body ?? {}) as Record<string, unknown>
    const title = payload.title
    const description = payload.description

    if (!title) {
        return { status: 400, message: 'Title and description are required' }
    }

    const userId = event.context.userId
    const task = await createTaskForUser(userId, title, description)
    return { status: 201, task }
})
