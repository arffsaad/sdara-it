<template>
  <div>
    <div class="w-full h-screen bg-slate-200 flex items-center justify-around relative">
      <div class="absolute h-full w-full bg-white opacity-90 z-10"></div>
      <div class="h-full flex w-4/5 flex-col px-8 pt-12 relative">
        <div class="absolute inset-0 flex items-center justify-center">
          <img src="/sdaralogo.png" class="max-w-full max-h-full px-4">
        </div>
        <h1 class="text-4xl font-semibold md:text-3xl text-black z-20">MEMBERS LIST</h1>
        <div class="z-20 w-full justify-items-center bg-slate-100 mt-4">
          <Table :columns="columns" :people="rows" :loading="loading"></Table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'SDARA IT | Members List',
});

</script>
