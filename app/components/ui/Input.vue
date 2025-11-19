<template>
  <input
    :value="modelValue"
    @input="onInput"
    v-bind="$attrs"
    :class="inputClass"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ modelValue?: string }>()
const emit = defineEmits<(e: 'update:modelValue', v: string) => void>()

function onInput(e: Event) {
  const v = (e.target as HTMLInputElement).value
  emit('update:modelValue', v)
}

const inputClass = computed(() => {
  return 'w-full rounded-md border px-3 py-2 text-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-gray-900 dark:text-gray-100'
})
</script>

<style scoped>
</style>
