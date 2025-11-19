export default defineNuxtRouteMiddleware(async () => {
  try {
    const { user } = await $fetch('/api/auth/me')
    if (!user) return navigateTo('/auth/signin')
  } catch {
    return navigateTo('/auth/signin')
  }
})
