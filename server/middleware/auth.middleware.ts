import type { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
    try {
        // Skip middleware for API and auth routes to avoid redirecting API calls
        const reqUrl = (event.node && (event.node.req as any) && (event.node.req as any).url) || ''
        if (typeof reqUrl === 'string' && (reqUrl.startsWith('/api') || reqUrl.startsWith('/auth'))) {
            return
        }

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