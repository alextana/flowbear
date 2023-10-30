<template>
  <div class="goals prose">
    <h1>{{ route.query.name }}</h1>
    <WidgetsActivityRepeater title="No activities found" />
  </div>
</template>

<script setup>
const route = useRoute()
</script>
