export default defineNuxtRouteMiddleware(async (to) => {
  // Don't run auth redirect on auth pages themselves
  if (to && to.path && to.path.startsWith('/auth')) return

  try {
    const { user } = await $fetch('/api/auth/me')
    if (!user) return navigateTo('/auth/signin')
  } catch {
    return navigateTo('/auth/signin')
  }
})
