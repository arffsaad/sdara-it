<template>
    <ClientOnly>
        <div class="bg-white">
            <QuillEditor theme="snow" toolbar="minimal" />
        </div>
    </ClientOnly>
</template>
  
<script setup>
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
</script>