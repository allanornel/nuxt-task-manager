<script setup lang="ts">
import { ref } from 'vue'
import type { Task } from '../../types/task'
import Card from './ui/Card.vue'
import Button from './ui/Button.vue'
import Switch from './ui/Switch.vue'
import IconPlus from './ui/IconPlus.vue'

const tasks = ref<Task[]>([])
const loading = ref(false)
const emit = defineEmits<{ (e: 'create'): void }>()

async function load() {
  loading.value = true
  try {
    const res = await $fetch('/api/task/tasks') as { tasks?: Task[] }
    tasks.value = (res?.tasks) || []
  } catch (err) {
    tasks.value = []
  } finally {
    loading.value = false
  }
}

await load()

async function toggleCompleted(t: Task) {
  try {
    const res = await $fetch('/api/task/tasks', {
      method: 'PATCH',
      body: { id: t.id, completed: !t.completed }
    })
    const updated = ((res as { task?: Task })?.task as Task) || null
    if (updated) {
      const idx = tasks.value.findIndex((x) => x.id === updated.id)
      if (idx !== -1) tasks.value[idx] = updated
    } else {
        console.error('No updated task returned from API')
        alert('Could not update task status')
    }
  } catch (err) {
    console.error('Could not toggle task', err)
  }
}

function add(task: Task) {
  tasks.value.unshift(task)
}

defineExpose({ load, add })
</script>

<template>
  <Card>
    <template #header>
        <div class="flex items-center justify-between w-full">
          <h2 class="text-lg font-medium">Your Tasks</h2>
          <div>
            <Button variant="ghost" aria-label="Create task" @click="emit('create')"><IconPlus /></Button>
          </div>
        </div>
    </template>

    <div v-if="loading" class="text-sm text-gray-600 dark:text-gray-300">Loading...</div>
    <div v-else>
      <div v-if="tasks.length === 0" class="text-sm text-gray-600 dark:text-gray-300">No tasks yet.</div>
      <ul class="space-y-3">
        <li v-for="t in tasks" :key="t.id" class="p-3 rounded border flex items-start gap-3">
          <Switch :modelValue="t.completed" @update:modelValue="() => toggleCompleted(t)" />
          <div class="flex-1">
            <div :class="['font-semibold', t.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-50']">{{ t.title }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-300">{{ t.description }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">Updated: {{ t.updatedAt ? new Date(t.updatedAt).toLocaleString() : 'Never' }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">Created: {{ new Date(t.createdAt).toLocaleString() }}</div>
          </div>
        </li>
      </ul>
    </div>
  </Card>
</template>

<style scoped>
</style>
