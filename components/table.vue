<script setup lang="ts">

// expose the columns and people to the template
defineProps<{
    columns: []
    people: []
}>()

</script>

<template>
    <UTable :ui="{
        th: {
            color: 'text-black dark:text-black'
        },
            emptyState: {
                label : 'dark:text-black'
        }
    }" :columns="columns" :rows="people"
        :empty-state="{ icon: 'i-heroicons-user-20-solid', label: 'No Members Registered/Approved yet.' }" />
</template>

