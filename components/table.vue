<script setup>

// ref for loading state
const loading = ref(true);
const people = ref([]);

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
const page = ref(1)
const pageCount = 10
const rows = computed(() => {
  return people.value.slice((page.value - 1) * pageCount, (page.value) * pageCount)
})

</script>

<template>
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
    }" :columns="columns" :rows="rows"
        :empty-state="{ icon: 'i-heroicons-user-20-solid', label: 'No Members Registered/Approved yet.' }"
        :loading="loading" />
    <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
        <UPagination v-model="page" :page-count="pageCount" :total="people.length" />
    </div>
</template>

