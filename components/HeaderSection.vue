<template>
  <div class="lg:w-1/2 text-center lg:text-left">
    <h1 class="mt-10 text-4xl font-bold text-gray-900 sm:text-6xl">{{ config.contestTitle }}</h1>
    <p class="mt-6 text-lg text-gray-600">{{ config.contestStartTime }} - {{ config.contestEndTime }}</p>
    <div class="mt-10 flex justify-center lg:justify-start">
      <input 
        type="text" 
        v-model="teamName" 
        placeholder="输入您的团队名称" 
        class="input input-bordered w-full max-w-xs"
        @keyup.enter="handleSubmit"
        @input="handleInput"
      />
      <button 
        class="btn ml-2" 
        @click="handleSubmit"
        :disabled="!teamName.trim() || isLoading"
      >
        {{ isLoading ? '生成中...' : '制作' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { debounce } from '~/utils/debounce';
import { getAppConfig } from '~/utils/config';

const props = defineProps(['isLoading']);
const emit = defineEmits(['generate']);
const config = getAppConfig();

const teamName = ref('');

const handleSubmit = () => {
  const name = teamName.value.trim();
  if (name) {
    emit('generate', name);
  }
};

// 防抖输入处理
const debouncedGenerate = debounce((name) => {
  if (name.trim()) {
    emit('generate', name.trim());
  }
}, 500);

const handleInput = () => {
  const name = teamName.value.trim();
  if (name.length > 2) { // 至少输入3个字符才开始自动生成
    debouncedGenerate(name);
  }
};
</script> 