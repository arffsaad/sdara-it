<!-- DEFAULT/SM SHOULD USE SLIDER -->
<template>
    <div class="z-10 sticky top-0 bg-white w-screen h-12 flex items-center">
        <div class="z-20 h-6 w-6 ml-4 bg-black" @click="toggleMenu"></div> <!-- md hidden here -->
        <div class="flex w-full justify-center">
            
        </div>
    </div>
    <div :class="'absolute top-0 h-screen w-screen bg-black transition' +  (menuOpen ? ' opacity-70' : ' opacity-0')">
    </div>
    <div :class="'absolute top-0 bg-white h-full shadow-md pt-20 transition-width z-10' + (menuOpen ? ' w-3/5 sticky' : ' w-0')">
        <div class="flex justify-center">
            <div :class="'grid grid-cols-1 gap-y-6 font-thin text-lg uppercase font-sans justify-items-center' + (menuOpen ? '' : ' hidden')">
                <h1>Home</h1>
                <h1>About Us</h1>
                <h1>Login</h1>
                <h1>Register</h1>
                <h1>Members List</h1>
            </div>
        </div>
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