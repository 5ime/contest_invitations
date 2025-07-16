<template>
  <div class="relative bg-white mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:flex lg:items-center lg:px-8">
    <HeaderSection 
      :is-loading="isLoading" 
      @generate="handleGeneratePoster" 
    />
    <PosterGenerator 
      :poster-url="posterUrl" 
      :is-loading="isLoading" 
    />
    
    <div v-if="error" class="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 max-w-sm">
      <div class="flex items-center justify-between">
        <span>{{ error }}</span>
        <button @click="clearError" class="ml-2 text-white hover:text-gray-200">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onUnmounted } from 'vue';
import HeaderSection from '~/components/HeaderSection.vue';
import PosterGenerator from '~/components/PosterGenerator.vue';

const { isLoading, error, posterUrl, generatePoster, cleanup } = useApiGenerator();

const handleGeneratePoster = (teamName) => {
  generatePoster(teamName);
};

const clearError = () => {
  cleanup();
};

onUnmounted(() => {
  cleanup();
});
</script>

<style>
::selection { 
  background: rgba(0, 149, 255, 0.1); 
}

::-webkit-scrollbar { 
  width: 8px; 
}

::-webkit-scrollbar-thumb { 
  border-radius: 10px; 
  background: rgba(0, 0, 0, 0.2); 
}

::-webkit-scrollbar-thumb:hover { 
  background: rgba(0, 0, 0, 0.3); 
}

.btn {
  @apply transition-all duration-200 ease-in-out;
}

.input {
  @apply transition-all duration-200 ease-in-out;
}

.input:focus {
  @apply border-primary;
}
</style>