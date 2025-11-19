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
  <div class="auth-page">
    <h1>Sign in</h1>
    <form @submit.prevent="submit">
      <div>
  <label>Email</label>
  <input v-model="email" required type="email">
      </div>
      <div>
  <label>Password</label>
  <input v-model="password" required type="password">
      </div>
      <div v-if="error" style="color:tomato">{{ error }}</div>
      <button type="submit" :disabled="loading">{{ loading ? 'Signing...' : 'Sign in' }}</button>
    </form>
    <p>Don't have an account? <NuxtLink to="/auth/signup">Sign up</NuxtLink></p>
  </div>
</template>

<style scoped>
.auth-page { max-width: 420px; margin: 3rem auto; padding: 1rem }
form > div { margin-bottom: 0.75rem }
label { display:block; font-size:0.9rem; margin-bottom:0.25rem }
input { width:100%; padding:0.5rem }
button { padding:0.6rem 1rem }
</style>
