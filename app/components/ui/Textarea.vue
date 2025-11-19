<template>
  <textarea
    :value="modelValue"
    @input="onInput"
    v-bind="$attrs"
    :class="textareaClass"
  ></textarea>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ modelValue?: string }>()
const emit = defineEmits<(e: 'update:modelValue', v: string) => void>()

function onInput(e: Event) {
  const v = (e.target as HTMLTextAreaElement).value
  emit('update:modelValue', v)
}

const textareaClass = computed(() => 'w-full rounded-md border px-3 py-2 text-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-gray-900 dark:text-gray-100')
</script>

<style scoped>
</style>
