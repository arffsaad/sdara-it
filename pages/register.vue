<template>
    <div class="flex items-center justify-center h-screen w-screen bg-slate-100">
        <div
            class="w-full bg-slate-100 rounded-lg shadow-2xl flex flex-col md:grid md:grid-cols-2 gap-y-2 gap-x-2 px-12 py-8 mx-12 sm:mx-24 md:w-1/2 lg:w-1/2 xl:w-1/3">
            <h1 class="text-xl uppercase md:col-span-2">Register</h1>
            <input type="text" v-model="formData.firstName" placeholder="First Name" id="firstName" name="firstName"
                class="border-2 border-slate-200 rounded-lg p-4 h-12 bg-white" @change="v$.firstName.$touch" :class="{
                    'border-red-500 focus:border-red-500': v$.firstName.$error,
                    'border-[#42d392] ': !v$.firstName.$invalid,
                }">
            <input type="text" v-model="formData.lastName" placeholder="Last Name" id="lastName" name="lastName"
                class="border-2 border-slate-200 rounded-lg p-4 h-12 bg-white" @change="v$.lastName.$touch" :class="{
                    'border-red-500 focus:border-red-500': v$.lastName.$error,
                    'border-[#42d392] ': !v$.lastName.$invalid,
                }">
            <input type="text" v-model="formData.username" placeholder="Username" id="username" name="username"
                class="border-2 border-slate-200 rounded-lg p-4 h-12 bg-white" @change="v$.username.$touch" :class="{
                    'border-red-500 focus:border-red-500': v$.username.$error,
                    'border-[#42d392] ': !v$.username.$invalid,
                }">
            <input type="text" v-model="formData.email" placeholder="Email" id="email" name="email"
                class="border-2 border-slate-200 rounded-lg p-4 h-12 bg-white" @change="v$.email.$touch" :class="{
                    'border-red-500 focus:border-red-500': v$.email.$error,
                    'border-[#42d392] ': !v$.email.$invalid,
                }">
            <input type="password" v-model="formData.password" placeholder="Password" id="password" name="password"
                class="border-2 border-slate-200 rounded-lg p-4 h-12 bg-white" @change="v$.password.$touch" :class="{
                    'border-red-500 focus:border-red-500': v$.password.$error,
                    'border-[#42d392] ': !v$.password.$invalid,
                }">
            <input type="password" v-model="formData.passwordConfirm" placeholder="Confirm Password" id="passwordConfirm"
                name="passwordConfirm" class="border-2 border-slate-200 rounded-lg p-4 h-12 bg-white"
                @change="v$.passwordConfirm.$touch" :class="{
                    'border-red-500 focus:border-red-500': v$.passwordConfirm.$error,
                    'border-[#42d392] ': !v$.passwordConfirm.$invalid,
                }">
            <button @click="submitForm"
                class="col-span-2 border-2 border-slate-200 bg-slate-700 rounded-lg w-1/2 md:w-1/3 h-12 hover:bg-slate-900 text-white">Register</button>
            <div class="flex col-span-2">
                <div class="bg-slate-200 w-full h-1 mr-4 mt-2"></div>
                <p class="text-center">or</p>
                <div class="bg-slate-200 w-full h-1 ml-4 mt-2"></div>
            </div>
            <div class="w-full flex flex-col col-span-2">
                <NuxtLink to="/login" class="h-11 flex justify-center bg-white rounded-md border-2 border-black py-2">Sign
                    in</NuxtLink>
                <a v-for="method in data.authProviders" :key="method.id"
                    class="h-11 flex mt-4 justify-center bg-white rounded-md border-2 border-black py-2 cursor-pointer"
                    @click="oauth(method.name)" target="_blank">
                    Sign in with {{ capitalize(method.name) }}
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { required, email, sameAs, minLength } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

useHead({
    title: 'SDARA IT | Register',
});

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
const { data } = await useAsyncData(async (nuxtApp) => {
    // fetch and return all "example" records...
    const methods = await nuxtApp.$pb.collection('users').listAuthMethods();

    return structuredClone(methods);
})

const formData = reactive({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    passwordConfirm: null,
});

const rules = computed(() => {
    return {
        firstName: { required },
        lastName: { required },
        username: { required },
        email: { required, email },
        password: { required, minLength: minLength(6) },
        passwordConfirm: { required, sameAs: sameAs(formData.password) },
    };
});

const v$ = useVuelidate(rules, formData);

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
                    setTimeout(() => {
                        nuxtApp.$router.push('/profile');
                    }, 500);
                } else {
                    nuxtApp.$router.push('/');
                }
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
    v$.value.$validate();
    if (!v$.value.$error) {
        try {
            await useAsyncData(async (nuxtApp) => {
                // fetch and return all "example" records...
                await nuxtApp.$pb.collection('users').create(formData).then((res) => {
                    // redirect to login page
                    nuxtApp.$router.push('/login');
                })
            })
        } catch (error) {
            console.error('Error creating user:', error);
        }
    }
}
// const { authData } = await useAsyncData(async (nuxtApp) => {
//     const methods = await nuxtApp.$pb.collection('users').authWithOAuth2({ provider: 'google' });

//     return structuredClone(methods);
// })
</script>