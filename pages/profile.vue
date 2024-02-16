<template>
    <div class="flex items-center justify-center h-screen w-screen bg-slate-100">
        <div
            class="w-full bg-slate-100 rounded-lg shadow-2xl grid grid-cols-1 gap-y-3 px-8 md:px-12 py-8 mx-12 sm:mx-24 md:w-1/2 lg:w-1/2 xl:w-1/3">
            <div class="grid grid-cols-1 justify-items-center">
                <AvatarRoot
                    class="bg-blackA3 inline-flex h-16 w-16 md:h-24 md:w-24 select-none items-center justify-center overflow-hidden rounded-full align-middle">
                    <AvatarImage class="h-full w-full rounded-[inherit] object-cover" :src=avatarURL alt="Colm Tuite" />
                    <AvatarFallback
                        class="text-grass11 leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium"
                        :delay-ms="600">
                        {{ user.value?.firstName.charAt(0) + user.value?.lastName.charAt(0) }}
                    </AvatarFallback>
                </AvatarRoot>
            </div>
            <div>
                <h6 class="ml-4 mb-1">Full Name</h6>
                <input type="text" v-model="formData.identity" placeholder="Full Name" id="fullName" name="fullName"
                    class="border-2 border-slate-200 rounded-lg p-4 h-10 md:h-12 w-full bg-white" @change="v$.fullName.$touch"
                    :class="{
                        'border-red-500 focus:border-red-500': v$.fullName.$error,
                        'border-[#42d392] ': !v$.fullName.$invalid,
                    }">
            </div>
            <div>
                <h6 class="ml-4 mb-1">Nickname</h6>
                <input type="text" v-model="formData.identity" placeholder="Mail" id="nickname" name="nickname"
                    class="border-2 border-slate-200 rounded-lg p-4 h-10 md:h-12 w-full bg-white">
            </div>
            <div>
                <h6 class="ml-4 mb-1">Profile Summary</h6>
                    <Editor class="block"/>
            </div>
            <div class="w-full">
                <h6 class="ml-4 mb-1">Skills</h6>
                <div class="rounded-lg w-full bg-white px-4 py-3 flex flex-wrap">
                    <h1 v-if="selectedSkills.length === 0">None Selected</h1>
                    <UBadge v-for="skill in selectedSkills" :key="skill" class="mr-2 mb-2 rounded-full" color="cyan" variant="solid">
                        {{ skill.length > 7 ? skill.slice(0, 6) + '...' : skill }}&nbsp;&nbsp; 
                        <a href="#" @click="console.log(selectedSkills.splice(selectedSkills.indexOf(skill), 1))">
                            <font-awesome-icon icon="fa-solid fa-xmark"/>
                        </a>
                    </UBadge>
                </div>
                <div class="w-1/4">
                    <USelectMenu class="mt-2" v-model="selectedSkills" :options="skills" multiple placeholder="Skills" :popper="{ resize: true , strategy:'fixed' }"/>
                </div>
            </div>
            <div>
                <h6 class="ml-4 mb-1">Industries</h6>
            </div>
            <div>
                <h6 class="ml-4 mb-1">LinkedIn URL</h6>
                <input type="text" v-model="formData.identity" placeholder="https://linkedin.com/in/arffsaad" id="linkedin" name="linkedin"
                    class="border-2 border-slate-200 rounded-lg p-4 h-10 md:h-12 w-full bg-white">
            </div>
            
        </div>
    </div>
</template>

<script setup>
import { AvatarImage, AvatarRoot } from 'radix-vue'
import { required, sameAs, minLength } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

useHead({
    title: 'SDARA IT | Profile',
});

const cookie = useCookie("pb_auth");
const user = ref(cookie.value?.model);
const avatarURL = 'https://sdaraapi.arfsd.cyou/api/files/users/' + user.value?.id + '/' + user.value?.avatar;
const selectedSkills = ref([]);
const selectedIndustries = ref([]);
const skills = ref([]);
const industries = ref([]);

const formData = reactive({
    fullName: '',
    nickname: '',
    linkedin: '',
});

const rules = computed(() => {
    return {
        fullName: { required },
    };
});

const v$ = useVuelidate(rules, formData);

async function submitForm() {
    // prevent default form submission
    event.preventDefault();
    v$.value.$validate();
    if (!v$.value.$error) {
        spinner();
        await useAsyncData(async (nuxtApp) => {
            try {
                await nuxtApp.$pb.collection('users').authWithPassword();
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

await useAsyncData(async (nuxtApp) => {
  await nuxtApp.$pb.collection('skills').getFullList().then((res) => {
    console.log(res);
    skills.value = res.map((skill) => skill.name);
  });
})

</script>