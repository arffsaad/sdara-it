<!-- DEFAULT/SM SHOULD USE SLIDER -->
<template>
  <!-- Sidebar -->
  <div :class="'z-20 fixed top-0 bg-white w-screen h-12 flex items-center'">
    <div :class="'h-6 w-6 ml-4 md:hidden'" @click="toggleMenu"><font-awesome-icon icon="fa-solid fa-bars" /></div>
    <!-- md hidden here -->
    <div class="pl-6 *:pr-10 *:uppercase *:text-sm w-full justify-start hidden md:flex">
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/about">About Us</NuxtLink>
      <NuxtLink to="/login" :class="(authed ? 'hidden' : '')">Sign In</NuxtLink>
      <NuxtLink to="/members" :class="(authed ? '' : 'hidden')">Members List</NuxtLink>
      <div :class="'flex ml-auto ' + (authed ? '' : 'hidden')">
        <a href="#" class="mr-4">Hi {{ useCookie("pb_auth").value?.model?.firstName
        }}!</a>
        <a href="#" @click="logout">Logout</a>
      </div>
    </div>
  </div>

  <!-- Overlay background -->
  <div :class="'fixed inset-0 bg-black transition-opacity' + (menuOpen ? ' z-30 opacity-70' : ' hidden opacity-0')">
  </div>

  <!-- Sliding menu -->
  <div
    :class="'fixed top-0 bg-white h-full w-1/2 shadow-md pt-20 transition-transform transform-gpu' + (menuOpen ? ' z-40 translate-x-0' : ' -translate-x-full')">
    <div :class="'absolute h-6 w-6 top-3 left-4'" @click="toggleMenu"><font-awesome-icon icon="fa-solid fa-arrow-left" />
    </div>
    <div class="flex justify-center">
      <div :class="'grid grid-cols-1 gap-y-6 font-thin text-lg uppercase font-sans justify-items-center'">
        <a :class="'font-semibold ' + (authed ? '' : 'hidden')">Hi {{ useCookie("pb_auth").value?.model?.firstName
        }}!</a>
        <NuxtLink @click="toggleMenu" to="/">Home</NuxtLink>
        <NuxtLink @click="toggleMenu" to="/about">About Us</NuxtLink>
        <NuxtLink :class="(authed ? 'hidden' : '')" @click="toggleMenu" to="/login">Sign In</NuxtLink>
        <NuxtLink :class="(authed ? '' : 'hidden')" @click="toggleMenu" to="/members">Members List</NuxtLink>
        <a href="#" :class="(authed ? '' : 'hidden')" @click="logout">Logout</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, watch } from 'vue';
import { routerKey } from 'vue-router';

// create state "menuOpen"
const menuOpen = ref(false);
const authed = ref(false);
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const cookie = useCookie("pb_auth");
watch(() => cookie.value?.model, (newValue) => {
  authed.value = Boolean(newValue);
});
authed.value = Boolean(cookie.value?.model);

const logout = async () => {
  await useAsyncData(async (nuxtApp) => {
    nuxtApp.$pb.authStore.clear()
  }).then(() => {
    if (menuOpen.value) {
      toggleMenu();
    }
    nuxtApp.$router.push("/login");
  });
};
</script>