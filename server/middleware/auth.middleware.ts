import type { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
    try {
        const { getUserIdFromSession } = await import('../db/index')
        const token = getCookie(event, 'session') as string | undefined

        if (!token) {
            return sendRedirect(event, '/auth/signin', 302)
        }

        const userId = await getUserIdFromSession(token, true)
        if (!userId) {
            return sendRedirect(event, '/auth/signin', 302)
        }

        event.context.userId = userId

    } catch (error) {
        console.error('Error in auth middleware:', error)
        return sendRedirect(event, '/auth/signin', 302)
    }
})