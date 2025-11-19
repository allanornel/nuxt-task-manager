<script setup lang="ts">
import { ref } from 'vue'
import Button from '../components/ui/Button.vue'
import Modal from '../components/ui/Modal.vue'
import TaskForm from '../components/TaskForm.vue'
import TaskList from '../components/TaskList.vue'
import IconPlus from '../components/ui/IconPlus.vue'

definePageMeta({ middleware: 'auth' })

const { data } = await useFetch('/api/auth/me')
const user = data?.value?.user as { id: string; name: string; email: string } | null

import type { Task } from '../../types/task'
type TaskListApi = { load?: () => Promise<void>; add?: (t: Task) => void }
const taskListRef = ref<TaskListApi | null>(null)
const showModal = ref(false)

async function signout() {
  try {
    await $fetch('/api/auth/signout', { method: 'POST' })
  } catch {
  }
  return navigateTo('/auth/signin')
}

async function onCreated(task: Task | null) {
  try {
    if (task) {
      await taskListRef.value?.add?.(task)
      showModal.value = false
    } else {
      await taskListRef.value?.load?.()
    }
  } catch (e) {
    console.error('Error handling created task', e)
  }
}
</script>

<template>
  <div class="home max-w-3xl mx-auto mt-8 p-6" style="background:var(--background); color:var(--foreground)">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div>
          <h1 class="text-2xl font-semibold">Welcome</h1>
          <p class="text-sm text-gray-700 dark:text-gray-200 mt-1">Signed in as: <strong>{{ user?.name }}</strong> <span class="text-xs text-gray-600 dark:text-gray-300">({{ user?.email }})</span></p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <Button @click="signout" variant="destructive">Sign out</Button>
      </div>  
    </div>
      <div>
        <TaskList ref="taskListRef" @create="showModal = true" />
      </div>

      <Modal v-model="showModal">
        <template #header>
          <h3 class="text-lg font-medium">New Task</h3>
        </template>
        <TaskForm @created="onCreated" />
      </Modal>

      <!-- Floating FAB -->
      <button
        aria-label="Add task"
        @click="showModal = true"
        class="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl"
      >
        <IconPlus />
      </button>
  </div>
</template>

<style scoped>
.home { max-width: 720px; margin: 2rem auto }
button { margin-top: 1rem; cursor: pointer }
</style>
