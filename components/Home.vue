<template>
    <div class="relative bg-white mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:flex lg:items-center  lg:px-8">
        <div class="lg:w-1/2 text-center lg:text-left">
        <h1 class="mt-10 text-4xl font-bold text-gray-900 sm:text-6xl">MoeCTF 2024</h1>
        <p class="mt-6 text-lg text-gray-600">2020/01/01 00:00(UTC+8) - 2020/01/01/ 22:00(UTC+8)</p>
        <div class="mt-10 flex justify-center lg:justify-start">
            <input type="text" id="teamNameInput" placeholder="Enter your team name" class="input input-bordered w-full max-w-xs" />
            <a href="https://d3c.tf/" class="btn btn-ghost ml-2">Learn more</a>
        </div>
        </div>

        <div class="lg:w-1/2 mt-16 sm:mt-24 lg:mt-0 flex justify-center items-center">
        <div class="mockup-phone max-w-full drop-shadow-xl">
            <div class="camera"></div> 
            <div class="display">
            <div class="artboard artboard-demo phone-1">
                320 × 568
            </div>
            </div>
        </div>
        </div>
    </div>
</template>
<style>
::selection {
  background: #0095ff1a
}

::-webkit-scrollbar {
  width: 8px
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #0003
}
</style>