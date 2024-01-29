<template>
  <div>
    <div class="w-full h-screen bg-slate-200 flex items-center justify-around relative">
      <div class="absolute h-full w-full bg-white opacity-90 z-10"></div>
      <div class="h-full flex items-center px-8 relative">
        <div class="absolute inset-0 flex items-center justify-center">
          <img src="/sdaralogo.png" class="max-w-full max-h-full px-4">
        </div>
        <div class="grid grid-cols-1 gap-y-4 z-20 w-full max-w-2xl justify-items-center">
          <!-- Adjust max-width as needed -->
          <client-only>
            <Vue3Lottie animationLink="/animations/homeAnimation.json" class="flex pl-10 h-24 md:hidden" />
          </client-only>
          <h1 class="text-4xl font-semibold md:text-6xl">SDARA IT CHAPTER</h1>
          <h1 class="text-lg md:text-xl">
            Welcome to the SDARA IT Chapter. A place where IT Professionals and enthusiasts come together to harness
            synergy
            through knowledge and experiences.
          </h1>
        </div>
        <div class="grid-cols-1 gap-y-4 z-20 w-full max-w-2xl hidden md:grid"> <!-- Adjust max-width as needed -->
          <client-only>
            <Vue3Lottie animationLink="/animations/homeAnimation.json" class="pl-10 md:h-80" />
          </client-only>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
useHead({
  title: 'SDARA IT | Home',
});

// definePageMeta({
//   middleware: 'auth'
// })
</script>
