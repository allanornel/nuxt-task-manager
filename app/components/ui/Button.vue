<template>
  <button
    :class="buttonClass"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ variant?: 'primary' | 'ghost' | 'destructive'; disabled?: boolean }>()

const buttonClass = computed(() => {
  const base = 'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors'
  if (props.variant === 'destructive') return base + ' bg-red-600 text-white hover:bg-red-700 disabled:opacity-60'
  if (props.variant === 'ghost') return base + ' bg-transparent text-gray-700 dark:text-gray-200'
  return base + ' bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60'
})
</script>

<style scoped>
    button:disabled {
      cursor: not-allowed;
    }
    button {
        cursor: pointer;
    }
</style>
