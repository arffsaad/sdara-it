<script setup>

// expose the columns and people to the template
defineProps([
    'columns',
    'people',
    'loading'
])

const page = ref(1)
const pageCount = 1
const rows = computed(() => {
  return props.people.slice((page.value - 1) * pageCount, (page.value) * pageCount)
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

