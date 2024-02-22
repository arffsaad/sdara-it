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

watch(q, () => {
  page.value = 1;
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
];

await useLazyAsyncData(async (nuxtApp) => {
  // console.log(userId);
  // await nuxtApp.$pb.collection('people').getFirstListItem('user="' + userId + '"', {
  // }).then((res) => {
  //   people.value = res;
  //   loading.value = false;
  // });
  await nuxtApp.$pb.collection('people').getFullList({
    expand: ['user,skills,industries'],
    fields: ['*,expand.user.fullName,expand.user.email,expand.user.avatar,expand.user.id,expand.skills.name,expand.industries.name'],
  }).then((res) => {
    people.value = res.map((person) => {
      return {
        avatar: person.expand.user.id + "/" + person.expand.user.avatar,
        fullname: person.expand.user.fullName,
        nickname: person.nickname,
        batch: person.batch,
        linkedin: person.linkedin,
      }
    });
    console.log(people.value)
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
  }" :columns="columns" :rows="filteredRows"
    :empty-state="{ icon: 'i-heroicons-user-20-solid', label: emptyLabel }" :loading="loading">
    <template #avatar-data="{ row }">
      <AvatarRoot
          class="bg-blackA3 inline-flex h-12 w-12 md:h-16 md:w-16 select-none items-center justify-center overflow-hidden rounded-full align-middle">
        <AvatarImage class="h-full w-full rounded-[inherit] object-cover" :src='"https://sdaraapi.arfsd.cyou/api/files/users/" + row.avatar' />
          <AvatarFallback
              class="text-grass11 leading-1 flex h-full w-full items-center justify-center bg-white text-lg font-medium"
              :delay-ms="600">
              {{ "AB" }}
          </AvatarFallback>
      </AvatarRoot>
    </template>
    <template #linkedin-data="{ row }">
      <a :href="row.linkedin" class="text-blue-700 hover:text-blue-300" target="_blank">{{ row.linkedin }}</a>
    </template>
  </UTable>
  <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
    <UPagination v-model="page" :page-count="pageCount" :total="totalItems" />
  </div>
</template>

