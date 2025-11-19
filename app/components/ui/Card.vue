<template>
  <div class="p-4 rounded-lg border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm h-full">
    <div class="flex items-start justify-between mb-3">
      <slot name="header"></slot>
    </div>
    <div class="mb-3">
      <slot />
    </div>
    <div>
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>
