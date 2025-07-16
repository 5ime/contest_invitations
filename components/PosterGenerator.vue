<template>
  <div class="lg:w-1/2 mt-16 sm:mt-24 lg:mt-0 flex justify-center items-center">
    <div class="mockup-phone max-w-full drop-shadow-xl">
      <div class="camera"></div>
      <div class="display">
        <div :class="{ 'blur': isLoading }" class="artboard artboard-demo phone-1 relative">
          <img 
            :src="posterUrl || '/invitations.png'" 
            :alt="posterUrl ? 'Generated Team Poster' : 'Default Logo'" 
            class="h-full object-cover" 
          />
          <a 
            v-if="posterUrl" 
            :href="posterUrl" 
            download="moectf-invitation.png" 
            class="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-blue-600 transition-colors shadow-lg"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['posterUrl', 'isLoading']);
</script> 