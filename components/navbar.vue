<template>
    <div class="z-0 bg-slate-200 shadow-md xl:bg-red-300 w-screen h-12 flex items-center">
        <div class="h-6 w-6 ml-4 bg-black xl:hidden" @click="toggleMenu"></div>
        <div class="flex w-full justify-center">
            <span class="font-bold" >SDARA IT CHAPTER</span>
        </div>
    </div>
    <div :class="'absolute bg-black h-screen shadow-md transition-width ' + (menuOpen ? ' w-3/4' : ' w-0')">

    </div>
    
  </template>

<script setup lang="js">
    // create state "menuOpen"
    const menuOpen = useState('toggleMenu', () => false);

    // create function "toggleMenu"
    const toggleMenu = () => {
        menuOpen.value = !menuOpen.value;
    }
</script>