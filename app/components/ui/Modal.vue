<template>
  <teleport to="body">
    <div v-show="modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="close" />
      <div class="relative z-10 w-full max-w-lg mx-4">
        <div class="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          <div class="p-4">
            <slot name="header"></slot>
          </div>
          <div class="p-4 border-t border-slate-100 dark:border-slate-700">
            <slot />
          </div>
          <div class="p-4 border-t border-slate-100 dark:border-slate-700">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<(e: 'update:modelValue', v: boolean) => void>()

function close() {
  emit('update:modelValue', false)
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
</style>
