<template>
  <div class="mt-16 flex items-center justify-center sm:mt-24 lg:mt-0 lg:w-1/2">
    <div class="mockup-phone max-w-full drop-shadow-xl">
      <div class="camera" />
      <div class="display">
        <div
          class="artboard artboard-demo phone-1 group relative overflow-hidden"
          :class="{ blur: isLoading }"
        >
          <img
            :src="posterUrl || '/invitations.png'"
            :alt="posterUrl ? 'Generated Team Poster' : 'Default Logo'"
            class="h-full w-full object-cover transition-transform duration-500 ease-out"
            :class="{ 'group-hover:scale-[1.03]': posterUrl }"
          >

          <div
            v-if="posterUrl"
            class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden="true"
          />

          <div
            v-if="posterUrl"
            class="poster-overlay pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 pb-4"
          >
            <div
              class="pointer-events-auto flex w-full items-center justify-between gap-3 rounded-2xl bg-white/8 p-3 backdrop-blur-md"
            >
              <div class="min-w-0">
                <div class="truncate text-xs font-semibold text-white/95">
                  海报已生成
                </div>
                <div class="truncate text-[11px] text-white/70">
                  {{ downloadFileName }} · 点击下载保存到本地
                </div>
              </div>
              <a
                :href="posterUrl"
                :download="downloadFileName"
                class="group inline-flex shrink-0 items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-slate-900 shadow-[0_12px_38px_-16px_rgba(0,0,0,0.65)] ring-1 ring-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-900 hover:text-white"
                :aria-label="`下载 ${downloadFileName}`"
              >
                <span>下载</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toPosterFileName } from '~/utils/constants'
import type { PosterGeneratorProps } from '~/types'

const props = defineProps<PosterGeneratorProps>()

const downloadFileName = computed(() =>
  props.teamName ? toPosterFileName(props.teamName) : undefined,
)
</script>

<style scoped>
.poster-overlay {
  animation: overlay-in 0.4s ease-out;
}

@keyframes overlay-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
