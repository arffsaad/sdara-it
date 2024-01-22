<template>
    <div class="flex items-center justify-center h-screen w-screen">
        <div
            class="w-full bg-slate-100 rounded-lg shadow-2xl grid grid-cols-1 gap-y-2 px-12 py-8 mx-12 sm:mx-24 md:w-1/2 lg:w-1/2 xl:w-1/3">
            <h1 class="text-xl uppercase">Login</h1>
            <input type="text" v-model="formData.identity" placeholder="Username or Email" id="identity" name="identity"
                class="border-2 border-slate-200 rounded-lg p-4 h-12" @change="v$.username.$touch" :class="{
                    'border-red-500 focus:border-red-500': v$.identity.$error,
                    'border-[#42d392] ': !v$.identity.$invalid,
                }">
            <input type="password" v-model="formData.password" placeholder="Password" id="password" name="password"
                class="border-2 border-slate-200 rounded-lg p-4 h-12" @change="v$.password.$touch" :class="{
                    'border-red-500 focus:border-red-500': v$.password.$error,
                    'border-[#42d392] ': !v$.password.$invalid,
                }">
            <button @click="submitForm"
                class="login-button flex border-2 items-center justify-center border-slate-200 bg-slate-700 rounded-lg w-1/5 h-12 hover:bg-slate-900 text-white">
                <span class="spinner-button hidden">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                </span>
                Login</button>
            <div class="flex">
                <div class="bg-slate-200 w-full h-1 mr-4 mt-2"></div>
                <p class="text-center">or</p>
                <div class="bg-slate-200 w-full h-1 ml-4 mt-2"></div>
            </div>
            <div class="w-full flex flex-col">
                <NuxtLink to="/register" class="h-11 flex justify-center bg-white rounded-md border-2 border-black py-2">
                    Register new Account</NuxtLink>
                <!-- <a v-for="method in data.authProviders" :key="method.id"
                    class="h-11 flex mt-4 justify-center bg-white rounded-md border-2 border-black py-2"
                    :href="method.authUrl" target="_blank">
                    Sign in with {{ capitalize(method.name) }}
                </a> -->
            </div>
        </div>
    </div>
</template>

<script setup>
import { required, minLength } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
const { data } = await useAsyncData(async (nuxtApp) => {
    // fetch and return all "example" records...
    const methods = await nuxtApp.$pb.collection('users').listAuthMethods();

    return structuredClone(methods);
})

const formData = reactive({
    identity: '',
    password: '',
});

const rules = computed(() => {
    return {
        identity: { required },
        password: { required, minLength: minLength(6) },
    };
});

const v$ = useVuelidate(rules, formData);

function spinner() {
    const spinner = document.querySelector('.spinner-button');
    const loginButton = document.querySelector('.login-button');
    spinner.classList.toggle('hidden');
    loginButton.classList.disabled = true;
}

function spinnerEnd() {
    const spinner = document.querySelector('.spinner-button');
    const loginButton = document.querySelector('.login-button');
    spinner.classList.toggle('hidden');
    loginButton.classList.disabled = false;
}

async function submitForm() {
    v$.value.$validate();
    if (!v$.value.$error) {
        spinner();
        try {
            await useAsyncData(async (nuxtApp) => {
                // fetch and return all "example" records...
                await nuxtApp.$pb.collection('users').authWithPassword(
                    formData.identity,
                    formData.password,
                ).then((res) => {
                    if (res.code != 400) {
                        // redirect to home page
                        nuxtApp.$router.push('/');
                    } 
                })
            })
        } catch (error) {
            console.error('Error:', error);
        }
        spinnerEnd();
    }
}

</script>