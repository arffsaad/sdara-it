<template>
    <div class="flex items-center justify-center h-screen w-screen bg-slate-100">
        <div
            class="w-full bg-slate-100 rounded-lg shadow-2xl grid grid-cols-1 gap-y-2 px-12 py-8 mx-12 sm:mx-24 md:w-1/2 lg:w-1/2 xl:w-1/3">
            <div class="grid grid-cols-1 justify-items-center">
                <AvatarRoot
                    class="bg-blackA3 inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full align-middle">
                    <AvatarImage class="h-full w-full rounded-[inherit] object-cover" :src=avatarURL alt="Colm Tuite" />
                    <AvatarFallback
                        class="text-grass11 leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium"
                        :delay-ms="600">
                        {{ user.value?.firstName.charAt(0) + user.value?.lastName.charAt(0) }}
                    </AvatarFallback>
                </AvatarRoot>
            </div>
            <input type="text" v-model="formData.identity" placeholder="Username or Email" id="identity" name="identity"
                class="border-2 border-slate-200 rounded-lg p-4 h-12 bg-white" @change="v$.username.$touch" :class="{
                    'border-red-500 focus:border-red-500': v$.identity.$error,
                    'border-[#42d392] ': !v$.identity.$invalid,
                }">
        </div>
    </div>
</template>

<script setup>
import { AvatarImage, AvatarRoot } from 'radix-vue'

const cookie = useCookie("pb_auth");
const user = ref(cookie.value?.model);

const avatarURL = 'https://sdaraapi.arfsd.cyou/api/files/users/' + user.value?.id + '/' + user.value?.avatar;

</script>