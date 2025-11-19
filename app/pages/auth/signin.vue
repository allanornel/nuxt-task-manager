<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from '#imports'
import { extractErrorMessage } from '../../../utils/extractErrorMessage'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await $fetch('/api/auth/signin', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    await router.push('/')
  } catch (err: unknown) {
    const msg = extractErrorMessage(err)
    console.error('msg'+msg);
    error.value = msg
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page max-w-md mx-auto mt-12 p-6 rounded-lg shadow-md" style="background:var(--card); color:var(--card-foreground)">
    <h1 class="text-2xl font-semibold mb-4">Sign in</h1>
    <form @submit.prevent="submit" class="space-y-4">
      <div>
        <label class="block text-sm mb-1">Email</label>
        <input v-model="email" required type="email" class="w-full px-3 py-2 rounded border" />
      </div>
      <div>
        <label class="block text-sm mb-1">Password</label>
        <input v-model="password" required type="password" class="w-full px-3 py-2 rounded border" />
      </div>
      <div v-if="error" class="text-sm text-red-400">{{ error }}</div>
      <button type="submit" :disabled="loading" class="w-full py-2 bg-primary text-primary-foreground rounded hover:opacity-95 disabled:opacity-50">
        {{ loading ? 'Signing...' : 'Sign in' }}
      </button>
    </form>
    <p class="mt-4 text-sm">Don't have an account? <NuxtLink to="/auth/signup" class="text-primary underline">Sign up</NuxtLink></p>
  </div>
</template>

<style scoped>
.auth-page { max-width: 420px; margin: 3rem auto; padding: 1rem }
form > div { margin-bottom: 0.75rem }
label { display:block; font-size:0.9rem; margin-bottom:0.25rem }
input { width:100%; padding:0.5rem }
button { padding:0.6rem 1rem }
</style>
