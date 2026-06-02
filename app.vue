<template>
  <div class="relative mx-auto max-w-7xl bg-white px-6 py-16 sm:py-20 lg:flex lg:items-center lg:px-8">
    <HeaderSection
      :is-loading="isLoading"
      @generate="generatePoster"
    />
    <PosterGenerator
      :poster-url="posterUrl"
      :team-name="teamName"
      :is-loading="isLoading"
    />

    <ErrorToast
      :message="error"
      @close="cleanup"
    />
  </div>
</template>

<script setup lang="ts">
const { isLoading, error, posterUrl, teamName, generatePoster, cleanup } = useApiGenerator()

onUnmounted(() => {
  cleanup()
})
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
