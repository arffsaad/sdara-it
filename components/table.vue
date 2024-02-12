<script setup>
const cookie = useCookie("pb_auth");
const userId = ref(cookie.value?.model?.id);

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
    label: 'Name',
    key: 'expand.user.fullName',
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
    filter: 'approved=true',
    expand: ['user,skills,industries'],
    fields: ['*,expand.user.fullName,expand.user.email,expand.user.avatar,expand.skills.name,expand.industries.name'],
  }).then((res) => {
    people.value = res;
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
      color: 'text-black dark:text-black font-semibold uppercase'
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
    :empty-state="{ icon: 'i-heroicons-user-20-solid', label: emptyLabel }" :loading="loading" />
  <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
    <UPagination v-model="page" :page-count="pageCount" :total="totalItems" />
  </div>
</template>

