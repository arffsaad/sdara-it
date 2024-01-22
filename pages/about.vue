<template>
  <div>
    <div class="w-full h-screen bg-slate-200 flex items-center justify-around relative">
      <div class="absolute h-full w-full bg-white opacity-90 z-10"></div>
      <div class="h-full flex items-center px-8 relative">
        <div class="absolute inset-0 flex items-center justify-center">
          <img src="/sdaralogo.png" class="max-w-full max-h-full px-4">
        </div>
        <div class="grid grid-cols-1 gap-y-4 z-20 w-full max-w-2xl"> <!-- Adjust max-width as needed -->
          <h1 class="text-4xl font-semibold">ABOUT US</h1>
          <p>
            Page in Construction. Stay tuned for more updates.
          </p>
        </div>
        <div class="grid grid-cols-1 gap-y-4 z-20 w-full max-w-2xl"> <!-- Adjust max-width as needed -->
          <client-only>
            <Vue3Lottie animationLink="/animations/homeAnimation.json" class="pl-10 md:h-80" />
          </client-only>
        </div>
      </div>
    </div>
  </div>
</template>
