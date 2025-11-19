<script setup lang="ts">
import { ref } from 'vue'
import type { Task } from '../../types/task'
import Card from './ui/Card.vue'
import Button from './ui/Button.vue'
import Input from './ui/Input.vue'
import Textarea from './ui/Textarea.vue'

const emit = defineEmits<{
  (e: 'created', payload: Task): void
}>()

const title = ref('')
const description = ref('')
const submitting = ref(false)

async function submit() {
  if (!title.value || !title.value.trim()) return
  submitting.value = true
  try {
    const res = await $fetch('/api/task/tasks', {
      method: 'POST',
      body: { title: title.value.trim(), description: description.value }
    }) as { status?: number; task?: Task }
    const task = res.task
    if (task) emit('created', task)
    title.value = ''
    description.value = ''
  } catch (err) {
    console.error('Error creating task', err)
    alert('Could not create task')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Card>
    <template #header>
      <h2 class="text-lg font-medium">Create Task</h2>
    </template>

    <div>
      <div class="mb-3">
        <Input v-model="title" placeholder="Title" />
      </div>
      <div class="mb-3">
        <Textarea v-model="description" placeholder="Description (optional)" rows="4" />
      </div>
      <div class="flex gap-2">
        <Button :disabled="submitting" @click.prevent="submit">{{ submitting ? 'Creating...' : 'Create' }}</Button>
      </div>
    </div>

    <template #footer>
    </template>
  </Card>
</template>

<style scoped>
input, textarea { background: var(--background) }
</style>
