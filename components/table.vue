<script setup>
const cookie = useCookie("pb_auth");

// ref for loading state
const loading = ref(true);
const people = ref([]);
const page = ref(1);
const pageCount = 10;
const totalItems = ref(people.value.length);
const q = ref('');
const emptyLabel = ref('No Members found.');
const memberDetailsModal = ref(false);
const memberDetails = ref({
  batch: null,
  id: null,
  linkedin: null,
  nickname: null,
  summary: null,
  expand: {
    user: {
      avatar: null,
      email: null,
      fullName: null,
      id: null
    },
    skills: [],
    industries: []
  },
  avatarURL: null
});
const memberLoading = ref(false);

watch(q, () => {
  page.value = 1;
});

watch(memberDetailsModal, () => {
  if (!memberDetailsModal.value) {  
    setTimeout(() => {
      memberDetails.value = {
        batch: null,
        id: null,
        linkedin: null,
        nickname: null,
        summary: null,
        expand: {
          user: {
            avatar: null,
            email: null,
            fullName: null,
            id: null
          },
          skills: [],
          industries: []
        },
        avatarURL: null
      };
    }, 500);
  }
});

const columns = [
  {
    key: 'avatar',
  },
  {
    label: 'Name',
    key: 'fullname',
    sortable: true,
  },
  {
    label: 'Nickname',
    key: 'nickname',
  },
  {
    label: 'Batch Year',
    key: 'batch',
    sortable: true
  },
  {
    label: 'LinkedIn',
    key: 'linkedin',
  },
  {
    key: "view"
  }
];

await useLazyAsyncData(async (nuxtApp) => {
  await nuxtApp.$pb.collection('people').getFullList({
    expand: ['user,skills,industries'],
    fields: ['*,expand.user.fullName,expand.user.email,expand.user.avatar,expand.user.id,expand.skills.name,expand.industries.name'],
  }).then((res) => {
    people.value = res.map((person) => {
      return {
        avatar: person.expand.user.avatar == "" ? "" : person.expand.user.id + "/" + person.expand.user.avatar,
        fullname: person.expand.user.fullName,
        nickname: person.nickname,
        batch: person.batch,
        linkedin: person.linkedin,
        view: person.id
      }
    });
    loading.value = false;
  });
})

const filteredRows = computed(() => {
  if (!q.value) {
    totalItems.value = people.value.length;
    return people.value.slice((page.value - 1) * pageCount, (page.value) * pageCount)
  }
  let filtered = people.value.filter((person) => {
    return Object.values(person).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase())
    })
  })
  totalItems.value = filtered.length
  return filtered.slice((page.value - 1) * pageCount, (page.value) * pageCount)
})

function loadProfile(id) {
  memberLoading.value = true;
  memberDetailsModal.value = true;
  useAsyncData(async (nuxtApp) => {
    await nuxtApp.$pb.collection('people').getFirstListItem('id="' + id + '"', {
      expand: ['user,skills,industries'],
      fields: ['*,expand.user.fullName,expand.user.email,expand.user.avatar,expand.user.id,expand.skills.name,expand.industries.name'],
    }).then((res) => {
      memberDetails.value = {
        ...res,
        expand: {
          ...res.expand,
          user: {
            ...res.expand.user,
            avatar: res.expand.user.id + "/" + res.expand.user.avatar
          }
        }
      };
      memberLoading.value = false;
      console.log(memberDetails.value)
    });
  });
}

</script>

<template>
  <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
    <UInput v-model="q" placeholder="Filter people..." icon="i-heroicons-magnifying-glass-20-solid" color="white"
      variant="outline" :ui="{
        color: {
          white: {
            outline: 'shadow-sm bg-white text ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-500'
          }
        }
      }" />
  </div>
  <UTable :ui="{
    base: 'min-w-full table-fixed',
    th: {
      color: 'text-black dark:text-black font-semibold'
    },
    td: {
      color: 'text-black dark:text-black'
    },
    emptyState: {
      label: 'dark:text-black'
    },
    loadingState: {
      label: 'dark:text-black'
    },
  }" :columns="columns" :rows="filteredRows" :empty-state="{ icon: 'i-heroicons-user-20-solid', label: emptyLabel }"
    :loading="loading">
    <template #avatar-data="{ row }">
      <AvatarRoot
        class="bg-blackA3 inline-flex h-12 w-12 md:h-16 md:w-16 select-none items-center justify-center overflow-hidden rounded-full align-middle">
        <AvatarImage class="h-full w-full rounded-[inherit] object-cover"
          :src='"https://sdaraapi.arfsd.cyou/api/files/users/" + row.avatar' />
        <AvatarFallback
          class="text-grass11 leading-1 flex h-full w-full items-center justify-center bg-white text-lg font-medium"
          :delay-ms="600">
          {{ row.fullname.split(' ')[0][0] + row.fullname.split(' ')[0][1] }}
        </AvatarFallback>
      </AvatarRoot>
    </template>
    <template #linkedin-data="{ row }">
      <a :href="row.linkedin" class="text-blue-700 hover:text-blue-300" target="_blank">{{ row.linkedin }}</a>
    </template>
    <template #view-data="{ row }">
      <div class="w-36 h-8 relative flex items-center justify-between p-4 group cursor-pointer"
        @click="loadProfile(row.view)">
        <span class="text-white z-10"><font-awesome-icon icon="fa-solid fa-arrow-right" /></span>
        <span class="font-semibold group-hover:text-white z-10 transition delay-150">View&nbsp;profile</span>
        <div
          class="rounded-full absolute inset-0 translate-x-1.5 bg-black h-8 w-8 group-hover:w-36 transition-width">
        </div>
      </div>
    </template>
  </UTable>
  <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
    <UPagination v-model="page" :page-count="pageCount" :total="totalItems" />
  </div>
  <UModal v-model="memberDetailsModal">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="w-full flex justify-between items-center">
          <div>
            <USkeleton :class="'h-6 w-full ' + (memberLoading ? '' : 'hidden')" />
            <h1 :class="'text-lg ' + (memberLoading ? 'hidden' : '')">Member Profile</h1>
          </div>
          <font-awesome-icon icon="fa-solid fa-times" class="cursor-pointer" @click="memberDetailsModal = false"/>
        </div>
      </template>

      <div :class="'grid grid-cols-1 gap-y-3 ' + (memberLoading ? '' : 'hidden')">
        <USkeleton class="h-4 w-[250px]" />
        <USkeleton class="h-4 w-[200px]" />
        <USkeleton class="h-4 w-[200px]" />
        <USkeleton class="h-4 w-[200px]" />
        <USkeleton class="h-4 w-[200px]" />
        <USkeleton class="h-4 w-[200px]" />
      </div>
      <div class="grid grid-cols-1 w-full justify-items-center gap-y-4">
        <AvatarRoot
          class="bg-blackA3 inline-flex h-20 w-20 md:h-32 md:w-32 select-none items-center justify-center overflow-hidden rounded-full align-middle">
          <AvatarImage v-if="memberDetails.expand.user.avatar != ''" class="h-full w-full rounded-[inherit] object-cover"
            :src='"https://sdaraapi.arfsd.cyou/api/files/users/" + memberDetails.expand.user.avatar' />
          <AvatarFallback
            class="text-grass11 leading-1 flex h-full w-full items-center justify-center bg-slate-200 text-2xl font-medium"
            :delay-ms="600">
            {{ memberDetails.expand.user.fullName.split(' ')[0][0] + memberDetails.expand.user.fullName.split(' ')[0][1] }}
          </AvatarFallback>
        </AvatarRoot>
        <div class="flex flex-col items-center">
          <h1 class="text-lg">{{ memberDetails.expand.user.fullName }} ({{ memberDetails.nickname }})</h1>
          <h2 class="text-sm text-gray-500 dark:text-gray-400">SDARA Class of {{ memberDetails.batch }}</h2>
        </div>
        <div class="flex flex-col items-center">
          <h1 class="text-lg">Expertise</h1>
          <div class="flex flex-wrap justify-center gap-2">
            <USkeleton v-if="memberLoading" class="h-4 w-20" />
            <div v-else v-for="skill in memberDetails.expand.skills" :key="skill.id"
              class="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
              {{ skill.name }}
            </div>
          </div>
        </div>
        <div class="flex flex-col items-center">
          <h1 class="text-lg">Industries</h1>
          <div class="flex flex-wrap justify-center gap-2">
            <USkeleton v-if="memberLoading" class="h-4 w-20" />
            <div v-else v-for="industry in memberDetails.expand.industries" :key="industry.id"
              class="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
              {{ industry.name }}
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </UModal>
</template>

