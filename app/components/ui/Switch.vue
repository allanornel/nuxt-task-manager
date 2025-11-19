<template>
  <button
    type="button"
    :aria-pressed="modelValue"
    @click="toggle"
    :class="['inline-flex items-center w-10 h-6 rounded-full p-1 transition-colors', modelValue ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600']"
  >
    <span :class="['block w-4 h-4 rounded-full bg-white transform transition-transform', modelValue ? 'translate-x-4' : 'translate-x-0']"></span>
  </button>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<(e: 'update:modelValue', v: boolean) => void>()

function toggle() {
  emit('update:modelValue', !props.modelValue)
}
</script>

<style scoped>
</style>
