<template>
    <div class="flex items-center justify-center h-screen w-screen bg-slate-100">
        <div
            class="w-full bg-slate-100 rounded-lg shadow-2xl grid grid-cols-1 gap-y-3 px-8 md:px-12 py-8 mx-12 sm:mx-24 md:w-1/2 lg:w-1/2 xl:w-1/3">
            <div class="grid grid-cols-1 justify-items-center">
                <AvatarRoot
                    class="bg-blackA3 inline-flex h-16 w-16 md:h-24 md:w-24 select-none items-center justify-center overflow-hidden rounded-full align-middle">
                    <AvatarImage class="h-full w-full rounded-[inherit] object-cover" :src=avatarURL alt="Colm Tuite" />
                    <AvatarFallback
                        class="text-grass11 leading-1 flex h-full w-full items-center justify-center bg-white text-lg font-medium"
                        :delay-ms="600">
                        {{ user.firstName.charAt(0) + user.lastName.charAt(0) }}
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
            <div class="w-full grid grid-cols-1">
                <h6 class="ml-4 mb-1">Skills</h6>
                <div class='w-full flex flex-wrap'>
                    <UBadge v-for="skill in selectedSkills" :key="skill.id" class="mr-2 mb-2 rounded-full" color="gray" variant="solid">
                        {{ skill.name.length > 7 ? skill.name.slice(0, 6) + '...' : skill.name }}&nbsp;&nbsp; 
                        <a href="#" @click="removeSkill(skill)">
                            <font-awesome-icon icon="fa-solid fa-xmark"/>
                        </a>
                    </UBadge>
                </div>
                <USelectMenu class="ml-4 mt-2 w-1/3" v-model="selectedSkills" :options="skills" multiple placeholder="Skills" color="white" searchable searchable-placeholder="Search skill..." option-attribute="name">
                    <template #label>
                        <span>Skills</span>
                    </template>
                    <template #option-empty="{ query }">
                        <span v-if="!selectedSkills.some(skill => skill.name.toLowerCase() === query.toLowerCase())" class="text-black cursor-pointer hover:underline" @click="createSkill(query)">Add <q>{{ query }}</q></span>
                        <span v-else>&nbsp;</span>
                    </template>
                </USelectMenu>
            </div>
            <div class="w-full grid grid-cols-1">
                <h6 class="ml-4 mb-1">Industries Worked In</h6>
                <div class='w-full flex flex-wrap'>
                    <UBadge v-for="industry in selectedIndustries" :key="industry.id" class="mr-2 mb-2 rounded-full" color="gray" variant="solid">
                        {{ industry.name.length > 12 ? industry.name.slice(0, 6) + '...' : industry.name }}&nbsp;&nbsp; 
                        <a href="#" @click="removeIndustry(industry)">
                            <font-awesome-icon icon="fa-solid fa-xmark"/>
                        </a>
                    </UBadge>
                </div>
                <USelectMenu class="ml-4 mt-2 w-1/3" v-model="selectedIndustries" :options="industries" multiple placeholder="Industries" color="white" searchable searchable-placeholder="Search industry..." option-attribute="name">
                    <template #label>
                        <span>Industries</span>
                    </template>
                    <template #option-empty="{ query }">
                        <span v-if="!selectedIndustries.some(industry => industry.name.toLowerCase() === query.toLowerCase())" class="text-black cursor-pointer hover:underline" @click="createIndustry(query)">Add <q>{{ query }}</q></span>
                        <span v-else>&nbsp;</span>
                    </template>
                </USelectMenu>
            </div>
            <div>
                <h6 class="ml-4 mb-1">LinkedIn URL</h6>
                <input type="text" v-model="formData.identity" placeholder="https://linkedin.com/in/arffsaad" id="linkedin" name="linkedin"
                    class="border-2 border-slate-200 rounded-lg p-4 h-10 md:h-12 w-full bg-white">
            </div>
            <UModal v-model="loadingModal">
                <div class="p-4 flex justify-center">
                    <span class="spinner-button">
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                    </span>
                    <span>Loading ...</span>
                </div>
            </UModal>
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
const skillsList = ref([]);
const industriesList = ref([]);
const loadingModal = ref(false);

watch(selectedSkills, () => {
    refreshList();
});

watch(selectedIndustries, () => {
    refreshList();
});

function refreshList() {
    skills.value = skillsList.value.filter(skill => !selectedSkills.value.includes(skill));
    industries.value = industriesList.value.filter(industry => !selectedIndustries.value.includes(industry));
}

function removeSkill(skill) {
    selectedSkills.value = selectedSkills.value.filter(s => s !== skill);
    refreshList();
}

function removeIndustry(industry) {
    selectedIndustries.value = selectedIndustries.value.filter(s => s !== industry);
    refreshList();
}

async function createSkill(skill) {
    loadingModal.value = true;
    await useAsyncData(async (nuxtApp) => {
        try {
            await nuxtApp.$pb.collection('skills').create({ name: skill }).then((res) => {
                selectedSkills.value.push({ id: res.id, name: res.name });
                refreshList();
            });
        } catch (error) {
            console.error(error);
        } finally {
            loadingModal.value = false;
        }
    });
}

async function createIndustry(industry) {
    loadingModal.value = true;
    await useAsyncData(async (nuxtApp) => {
        try {
            await nuxtApp.$pb.collection('industries').create({ name: industry }).then((res) => {
                selectedIndustries.value.push({ id: res.id, name: res.name });
                refreshList();
            });
        } catch (error) {
            console.error(error);
        } finally {
            loadingModal.value = false;
        }
    });
}

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
    skills.value = res.map((skill) => ({ id: skill.id, name: skill.name }));
    skillsList.value = res.map((skill) => ({ id: skill.id, name: skill.name }));
    refreshList();
  });
  await nuxtApp.$pb.collection('industries').getFullList().then((res) => {
    industries.value = res.map((industries) => ({ id: industries.id, name: industries.name }));
    industriesList.value = res.map((industries) => ({ id: industries.id, name: industries.name }));
    refreshList();
  });
})

</script>