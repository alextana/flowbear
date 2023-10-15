<template>
  <div>
    {{ route.params.id }}

    {{ data }}
  </div>
</template>

<script setup>
const route = useRoute()

const { data, pending, error } = useFetch('/api/activities/getActivities', {
  params: {
    goalId: route.params.id,
  },
  key: 'goalActivities',
})
</script>
