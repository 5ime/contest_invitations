<template>
  <div
    v-if="message"
    class="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg bg-red-500 px-4 py-2 text-white shadow-lg"
    role="alert"
  >
    <div class="flex items-center justify-between">
      <span>{{ message }}</span>
      <button
        type="button"
        class="ml-2 text-white hover:text-gray-200"
        aria-label="关闭错误提示"
        @click="emit('close')"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string | null
}>()

const emit = defineEmits<{
  close: []
}>()
</script>
