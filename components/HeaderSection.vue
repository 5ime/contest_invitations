<template>
  <div class="lg:w-1/2 text-center lg:text-left">
    <h1 class="mt-10 text-4xl font-bold text-gray-900 sm:text-6xl">
      {{ config.contestTitle }}
    </h1>
    <p class="mt-6 text-lg text-gray-600">
      {{ config.contestStartTime }} - {{ config.contestEndTime }}
    </p>
    <div class="mt-10 flex justify-center lg:justify-start">
      <input
        v-model="teamName"
        type="text"
        placeholder="输入您的团队名称"
        class="input input-bordered w-full max-w-xs"
        :disabled="isLoading"
        @keyup.enter="handleSubmit"
        @input="handleInput"
      >
      <button
        type="button"
        class="btn ml-2"
        :disabled="!teamName.trim() || isLoading"
        @click="handleSubmit"
      >
        {{ isLoading ? '生成中...' : '制作' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { debounce } from '~/utils/debounce'
import { getAppConfig } from '~/utils/config'
import { DEBOUNCE_MS, MIN_AUTO_GENERATE_NAME_LENGTH } from '~/utils/constants'
import type { HeaderSectionProps } from '~/types'

defineProps<HeaderSectionProps>()

const emit = defineEmits<{
  generate: [teamName: string]
}>()

const config = getAppConfig()
const teamName = ref('')

const handleSubmit = () => {
  const name = teamName.value.trim()
  if (name) {
    emit('generate', name)
  }
}

const debouncedGenerate = debounce((name: string) => {
  if (name.trim()) {
    emit('generate', name.trim())
  }
}, DEBOUNCE_MS)

const handleInput = () => {
  const name = teamName.value.trim()
  if (name.length >= MIN_AUTO_GENERATE_NAME_LENGTH) {
    debouncedGenerate(name)
  }
}
</script>
