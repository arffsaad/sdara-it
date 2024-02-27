<template>
    <div class="flex items-center justify-center h-full w-full bg-slate-100">
        <div
            class="w-full bg-slate-100 rounded-lg shadow-2xl grid grid-cols-1 gap-y-3 px-8 md:px-12 py-8 mx-12 my-10 sm:mx-24 md:w-1/2 lg:w-1/2 xl:w-1/3">
            <div class="grid grid-cols-1 justify-items-center">
                <div class="relative group cursor-pointer">
                    <AvatarRoot
                        class="bg-blackA3 inline-flex h-16 w-16 md:h-24 md:w-24 select-none items-center justify-center overflow-hidden rounded-full align-middle" :key="avatarLoading">
                        <AvatarImage class="h-full w-full rounded-[inherit] object-cover" v-bind:src=avatarURL />
                        <AvatarFallback
                            class="text-grass11 leading-1 flex h-full w-full items-center justify-center bg-white text-lg font-medium"
                            :delay-ms="600">
                            {{ user.firstName.charAt(0) + user.lastName.charAt(0) }}
                        </AvatarFallback>
                    </AvatarRoot>
                    <div :class="'absolute top-0 left-0 h-full w-full rounded-full bg-opacity-90 bg-white text-xs flex items-center justify-center '+ (avatarLoading ? 'visible' : 'invisible')">
                        <svg class="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                    </div>
                    <div class="absolute top-0 left-0 h-full w-full rounded-full bg-opacity-90 bg-white invisible group-hover:visible text-xs flex items-center justify-center" @click="openPicker">CHANGE</div>
                    <input type="file" ref="imgInput" class="hidden" v-on:change="changeAvatar"/>
                </div>
            </div>
            <div>
                <h6 class="ml-4 mb-1">Full Name</h6>
                <input type="text" v-model="formData.fullName" placeholder="Ismail Bin Harun" id="fullName" name="fullName"
                    class="border-2 border-slate-200 rounded-lg p-4 h-10 md:h-12 w-full bg-white" @change="v$.fullName.$touch"
                    :class="{
                        'border-red-500 focus:border-red-500': v$.fullName.$error,
                        'border-[#42d392] ': !v$.fullName.$invalid,
                    }">
            </div>
            <div class="grid grid-cols-2 gap-x-4">
                <div>
                    <h6 class="ml-4 mb-1">Nickname</h6>
                    <input type="text" v-model="formData.nickname" placeholder="Mael" id="nickname" name="nickname"
                        class="border-2 border-slate-200 rounded-lg p-4 h-10 md:h-12 w-full bg-white">
                </div>
                <div>
                    <h6 class="ml-4 mb-1">SDARA Batch</h6>
                    <input type="number" v-model="formData.batch" placeholder="2009" id="batch" name="batch"
                        class="border-2 border-slate-200 rounded-lg p-4 h-10 md:h-12 w-full bg-white">
                </div>
            </div>
            <div>
                <h6 class="ml-4 mb-1">Profile Summary</h6>
                <UTextarea v-model="formData.summary" size="sm" placeholder="Write something about yourself..."/>
            </div>
            <div class="w-full grid grid-cols-1">
                <h6 class="ml-4 mb-1">Skills</h6>
                <div class='w-full flex flex-wrap p-1 md:overflow-y-scroll md:h-8 bg-slate-200 rounded-md no-scrollbar'>
                    <UTooltip v-for="skill in selectedSkills" :text="skill.name">
                        <UBadge :key="skill.id" class="mr-2 mb-2 rounded-full" color="gray" variant="solid">
                            {{ skill.name.length > 7 ? skill.name.slice(0, 6) + '...' : skill.name }}&nbsp;&nbsp; 
                            <a href="#" @click="removeSkill(skill)">
                                <font-awesome-icon icon="fa-solid fa-xmark"/>
                            </a>
                        </UBadge>
                    </UTooltip>
                </div>
                <USelectMenu class="ml-4 mt-2 w-1/2 md:w-1/3" v-model="selectedSkills" :options="skills" multiple placeholder="Skills" color="white" searchable searchable-placeholder="Search skill..." option-attribute="name" clear-search-on-close>
                    <template #label>
                        <span>Skills</span>
                    </template>
                    <template #option-empty="{ query }">
                        <span v-if="!selectedSkills.some(skill => skill.name.toLowerCase() === query.toLowerCase())" class="text-black cursor-pointer hover:underline" @click="createSkill(query)">Add <q>{{ query }}</q></span>
                        <span v-else>&nbsp;</span>
                    </template>
                    <template #empty>
                        Search or Add skill
                    </template>
                </USelectMenu>
            </div>
            <div class="w-full grid grid-cols-1">
                <h6 class="ml-4 mb-1">Industries Worked In</h6>
                <div class='w-full flex flex-wrap p-1 md:overflow-y-scroll md:h-8 bg-slate-200 rounded-md no-scrollbar'>
                    <UTooltip v-for="industry in selectedIndustries" :text="industry.name">
                        <UBadge :key="industry.id" class="mr-2 mb-2 rounded-full" color="gray" variant="solid">
                            {{ industry.name.length > 12 ? industry.name.slice(0, 6) + '...' : industry.name }}&nbsp;&nbsp; 
                            <a href="#" @click="removeIndustry(industry)">
                                <font-awesome-icon icon="fa-solid fa-xmark"/>
                            </a>
                        </UBadge>
                    </UTooltip>
                </div>
                <USelectMenu class="ml-4 mt-2 w-1/2 md:w-1/3" v-model="selectedIndustries" :options="industries" multiple placeholder="Industries" color="white" searchable searchable-placeholder="Search industry..." option-attribute="name" clear-search-on-close>
                    <template #label>
                        <span>Industries</span>
                    </template>
                    <template #option-empty="{ query }">
                        <span v-if="!selectedIndustries.some(industry => industry.name.toLowerCase() === query.toLowerCase())" class="text-black cursor-pointer hover:underline" @click="createIndustry(query)">Add <q>{{ query }}</q></span>
                        <span v-else>&nbsp;</span>
                    </template>
                    <template #empty>
                        Search or Add Industry
                    </template>
                </USelectMenu>
            </div>
            <div>
                <h6 class="ml-4 mb-1">LinkedIn URL</h6>
                <input type="text" v-model="formData.linkedin" placeholder="https://linkedin.com/in/ismailharun" id="linkedin" name="linkedin"
                    class="border-2 border-slate-200 rounded-lg p-4 h-10 md:h-12 w-full bg-white">
            </div>
            <button @click.stop="submitForm"
                class="update-button flex border-2 items-center justify-center border-slate-200 bg-slate-700 rounded-lg w-1/2 md:w-1/2 h-12 hover:bg-slate-900 text-white">
                <span class="spinner-button hidden">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                </span>
                Update Profile</button>
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
            <Toast :open="toaster" :message="toastMsg" />
        </div>
    </div>
</template>

<script setup>
import { AvatarImage, AvatarRoot } from 'radix-vue'
import { required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

useHead({
    title: 'SDARA IT | Profile',
});

const cookie = useCookie("pb_auth");
const user = ref(cookie.value?.model);
const avatarURL = ref('https://sdaraapi.arfsd.cyou/api/files/users/' + user.value?.id + '/' + user.value?.avatar);
const selectedSkills = ref([]);
const selectedIndustries = ref([]);
const skills = ref([]);
const industries = ref([]);
const skillsList = ref([]);
const industriesList = ref([]);
const loadingModal = ref(false);
const toaster = ref(false);
const toastMsg = ref('');
const timerRef = ref(0)
const imgInput = ref(null);
const avatarLoading = ref(false);

watch(selectedSkills, () => {
    refreshList();
});

watch(selectedIndustries, () => {
    refreshList();
});

const openPicker = () => {
    imgInput.value.click();
}

const changeAvatar = () => {
    avatarLoading.value = true;
    const file = imgInput.value.files[0];
    const formData = new FormData();
    formData.append('avatar', file);
    useAsyncData(async (nuxtApp) => {
        await nuxtApp.$pb.collection('users').update(user.value.id, formData).then((res) => {
            avatarLoading.value = false;
            avatarURL.value = 'https://sdaraapi.arfsd.cyou/api/files/users/' + res.id + '/' + res.avatar;
            toastMsg.value = 'Avatar updated successfully!';
            toaster.value = true;
        }); 
    });
}

function refreshList() {
    skills.value = skillsList.value.filter(skill => !selectedSkills.value.some(selectedSkill => selectedSkill.id === skill.id));
    industries.value = industriesList.value.filter(industry => !selectedIndustries.value.some(selectedind => selectedind.id === industry.id));
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
                skills.value.push({ id: res.id, name: res.name });
                skillsList.value.push({ id: res.id, name: res.name });
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
                industries.value.push({ id: res.id, name: res.name });
                industriesList.value.push({ id: res.id, name: res.name });
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
    batch: null,
    linkedin: '',
    summary: '',
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
                await nuxtApp.$pb.collection('people').getFirstListItem('user="' + user.value.id + '"').then((res) => {
                    nuxtApp.$pb.collection('people').update(res.id, {
                        nickname: formData.nickname,
                        linkedin: formData.linkedin,
                        batch: formData.batch,
                        summary: formData.summary,
                        skills: selectedSkills.value.map((skill) => skill.id),
                        industries: selectedIndustries.value.map((industry) => industry.id),
                    });
                });
            } catch (error) {
                nuxtApp.$pb.collection('people').create({
                    user: user.value.id,
                    nickname: formData.nickname,
                    linkedin: formData.linkedin,
                    batch: formData.batch,
                    summary: formData.summary,
                    skills: selectedSkills.value.map((skill) => skill.id),
                    industries: selectedIndustries.value.map((industry) => industry.id),
                });
            }
            nuxtApp.$pb.collection('users').update(user.value.id, {
                fullName: formData.fullName,
            }).then(() => {
                toastMsg.value = 'Profile updated successfully!';
                window.clearTimeout(timerRef.value)
                timerRef.value = window.setTimeout(() => {
                    toaster.value = true
                }, 100)
                spinner();
            });
        });
    }
}

function spinner() {
    const spinner = document.querySelector('.spinner-button');
    const loginButton = document.querySelector('.update-button');
    spinner.classList.toggle('hidden');
    loginButton.disabled = !loginButton.disabled;
}

await useAsyncData(async (nuxtApp) => {
    await nuxtApp.$pb.collection('skills').getFullList().then((res) => {
        skillsList.value = res.map((skill) => ({ id: skill.id, name: skill.name }));
    });
    await nuxtApp.$pb.collection('industries').getFullList().then((res) => {
        industriesList.value = res.map((industries) => ({ id: industries.id, name: industries.name }));
    }).then(async () => {
        try {
            await nuxtApp.$pb.collection('people').getFirstListItem('user="' + user.value.id + '"', {
                expand: 'user,skills,industries',
            }).then((res) => {
                formData.fullName = res.expand.user.fullName;
                formData.nickname = res.nickname;
                formData.linkedin = res.linkedin;
                formData.batch = res.batch;
                formData.summary = res.summary;
                selectedSkills.value = res.expand.skills.map((skill) => ({ id: skill.id, name: skill.name }));
                selectedIndustries.value = res.expand.industries.map((industry) => ({ id: industry.id, name: industry.name }));
            });
        } catch (error) {
            refreshList();
        }
    });
})

</script>