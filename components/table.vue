<script setup>

// ref for loading state
const loading = ref(true);
const people = ref([]);
const page = ref(1)
const pageCount = 1
const totalItems = ref(people.value.length)
const q = ref('');

watch(q, () => {
  page.value = 1;
});

const columns = [
  {
    label: 'Name',
    key: 'expand.user.fullName',
  },
  {
    label: 'Nickname',
    key: 'nickname',
  },
  {
    label: 'Batch Year',
    key: 'batch',
  },
  {
    label: 'LinkedIn',
    key: 'linkedin',
  },
];

await useLazyAsyncData(async (nuxtApp) => {
  await nuxtApp.$pb.collection('people').getFullList({
    expand: ['user,skills,industries'],
    fields: ['*,expand.user.fullName,expand.user.email,expand.user.avatar,expand.skills.name,expand.industries.name']
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
      <UInput v-model="q" placeholder="Filter people..." @change="page.value = 1" />
    </div>
  <UTable :ui="{
    base: 'min-w-full table-fixed rounded-lg',
    th: {
      color: 'text-black dark:text-black'
    },
    td: {
      color: 'text-black dark:text-black'
    },
    emptyState: {
      label: 'dark:text-black'
    }
  }" :columns="columns" :rows="filteredRows"
    :empty-state="{ icon: 'i-heroicons-user-20-solid', label: 'No Members found.' }"
    :loading="loading" />
  <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
    <UPagination v-model="page" :page-count="pageCount" :total="totalItems" />
  </div>
</template>

