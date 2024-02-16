<template>
    <div class="flex items-center justify-center h-screen w-screen bg-slate-100">
        <form @submit.prevent="submitForm"
            class="w-full bg-slate-100 rounded-lg shadow-2xl grid grid-cols-1 gap-y-2 px-12 py-8 mx-12 sm:mx-24 md:w-1/2 lg:w-1/2 xl:w-1/3">
            <h1 class="text-xl uppercase">Login</h1>
            <input type="text" v-model="formData.identity" placeholder="Username or Email" id="identity" name="identity"
                class="border-2 border-slate-200 rounded-lg p-4 h-12 bg-white" @change="v$.username.$touch" :class="{
                    'border-red-500 focus:border-red-500': v$.identity.$error,
                    'border-[#42d392] ': !v$.identity.$invalid,
                }">
            <input type="password" v-model="formData.password" placeholder="Password" id="password" name="password"
                class="border-2 border-slate-200 rounded-lg p-4 h-12 bg-white" @change="v$.password.$touch" :class="{
                    'border-red-500 focus:border-red-500': v$.password.$error,
                    'border-[#42d392] ': !v$.password.$invalid,
                }">
            <button @click.stop="submitForm"
                class="login-button flex border-2 items-center justify-center border-slate-200 bg-slate-700 rounded-lg w-1/2 md:w-1/3 h-12 hover:bg-slate-900 text-white">
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
                <ClientOnly>
                <a v-for="method in data.authProviders" :key="method.id"
                    class="h-11 flex mt-4 justify-center bg-white rounded-md border-2 border-black py-2 cursor-pointer"
                    @click="oauth(method.name)" target="_blank">
                    Sign in with {{ capitalize(method.name) }}
                </a>
                </ClientOnly>
            </div>
        </form>
    </div>
    <ToastProvider>
        <ToastRoot v-model:open="open"
            class="bg-white rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut">
            <ToastDescription as-child>
                Invalid Credentials!
            </ToastDescription>
            <ToastClose aria-label="Close">
                <span aria-hidden>×</span>
            </ToastClose>
        </ToastRoot>
        <ToastViewport
            class="[--viewport-padding:_20px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
    </ToastProvider>
</template>

<script setup>
import { required, minLength } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

useHead({
    title: 'SDARA IT | Login',
});

const open = ref(false)
const timerRef = ref(0)

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
const { data } = await useAsyncData(async (nuxtApp) => {
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

async function oauth(method) {
    await useAsyncData(async (nuxtApp) => {
        try {
            await nuxtApp.$pb.collection('users').authWithOAuth2({ provider: method }).then((res) => {
                if (res.meta.isNew) {
                    const username = res.meta.email.split('@')[0];
                    const fName = res.meta.rawUser.given_name;
                    const lName = res.meta.rawUser.family_name;
                    const image = res.meta.avatarUrl;
                    const record = res.record.id;
                    if (image != "" || image != null) {
                        const data = new FormData();
                        fetch(image).then((res) => {
                            // get blob
                            res.blob().then((imageBlob) => {
                                data.append('avatar', imageBlob, 'avatar.jpg');
                                data.append("username", username)
                                data.append("firstName", fName)
                                data.append("lastName", lName)
                                data.append("fullName", fName + " " + lName)
                                nuxtApp.$pb.collection('users').update(record, data);
                            });
                        });
                    } else {
                        const data = {
                            "username": username,
                            "firstName": fName,
                            "lastName": lName,
                            "fullName": fName + " " + lName
                        };
                        nuxtApp.$pb.collection('users').update(record, data);
                    }
                }
                nuxtApp.$router.push('/');
            })
        } catch (error) {
            open.value = false
            window.clearTimeout(timerRef.value)
            timerRef.value = window.setTimeout(() => {
                open.value = true
            }, 100)
        }
    })
}
async function submitForm() {
    // prevent default form submission
    event.preventDefault();
    v$.value.$validate();
    if (!v$.value.$error) {
        spinner();
        await useAsyncData(async (nuxtApp) => {
            try {
                await nuxtApp.$pb.collection('users').authWithPassword(
                    formData.identity,
                    formData.password,
                )
                nuxtApp.$router.push('/');
            } catch (error) {
                open.value = false
                window.clearTimeout(timerRef.value)
                timerRef.value = window.setTimeout(() => {
                    open.value = true
                }, 100)
            }
        })
        spinnerEnd();
    }
}

</script>