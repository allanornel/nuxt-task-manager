<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { data } = await useFetch('/api/auth/me')
const user = data?.value?.user as { id: string; name: string; email: string } | null

async function signout() {
  try {
    await $fetch('/api/auth/signout', { method: 'POST' })
  } catch {
    // ignore signout errors
  }
  return navigateTo('/auth/signin')
}
</script>

<template>
  <div class="home">
    <h1>Welcome</h1>
    <p v-if="user">Signed in as: <strong>{{ user.name }}</strong> ({{ user.email }})</p>
  <NuxtLink to="/auth/signup">Create another user</NuxtLink>
  <br>
    <button @click="signout">Sign out</button>
  </div>
</template>

<style scoped>
.home { max-width: 720px; margin: 2rem auto }
button { margin-top: 1rem }
</style>
