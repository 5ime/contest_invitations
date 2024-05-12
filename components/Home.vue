<template>
  <div class="relative bg-white mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:flex lg:items-center lg:px-8">
    <div class="lg:w-1/2 text-center lg:text-left">
      <h1 class="mt-10 text-4xl font-bold text-gray-900 sm:text-6xl">MoeCTF 2024</h1>
      <p class="mt-6 text-lg text-gray-600">2020/01/01 00:00(UTC+8) - 2020/01/01 22:00(UTC+8)</p>
      <div class="mt-10 flex justify-center lg:justify-start">
        <input type="text" v-model="teamNameInput" placeholder="Enter your team name" class="input input-bordered w-full max-w-xs" />
        <button class="btn ml-2" @click="handleApiCall">Make</button>
      </div>
    </div>
    <div class="lg:w-1/2 mt-16 sm:mt-24 lg:mt-0 flex justify-center items-center">
      <div class="mockup-phone max-w-full drop-shadow-xl">
        <div class="camera"></div>
        <div class="display">
          <div :class="{ 'blur': isRequesting }" class="artboard artboard-demo phone-1">
            <img :src="generatedPoster" alt="Team Poster" v-if="generatedPoster" class="h-[568px] w-[320px]" />
            <img v-else alt="Default Logo" src="/public/logo.png" class="h-[568px] w-[320px]" />
          </div>
        </div>
        <div class="flex justify-center items-end h-full relative">
          <button v-if="generatedPoster" @click="downloadPoster" class="btn btn-circle absolute bottom-8 rounded-full">
            <img src="/public/download.svg" alt="Download" class="w-6 h-6 rounded-full">
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const teamNameInput = ref('');
const generatedPoster = ref(null);
const isRequesting = ref(false);

async function handleApiCall() {
  const teamName = teamNameInput.value.trim();
  if (!teamName) {
    alert("Please enter your team name.");
    return;
  }
  isRequesting.value = true;
  try {
    const response = await fetch('/api/hello', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name: teamName }),
    });
    if (!response.ok) throw new Error(`Failed to create team: ${response.statusText}`);
    const data = await response.blob();
    generatedPoster.value = URL.createObjectURL(data);
  } catch (error) {
    console.error('An error occurred:', error);
    alert(error.message);
  } finally {
    isRequesting.value = false;
  }
}

function downloadPoster() {
  if (!generatedPoster.value) return;
  const a = document.createElement('a');
  a.href = generatedPoster.value;
  a.download = "GeneratedPoster.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
</script>
<style>
::selection { background: #0095ff1a; }
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-thumb { border-radius: 10px; background: #0003; }

.download-btn {
  width: 50px;
  padding: 12px;
  background-color: #787878; /* Neutral gray */
  border-radius: 50px;
  cursor: pointer;
  position: absolute;
  bottom: 30px;
  left: calc(50% - 25px);
}

.download-btn:hover {
  background-color: #606060; /* Slightly darker gray for hover */
}
</style>
