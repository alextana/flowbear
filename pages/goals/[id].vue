<template>
  <div class="goals prose">
    <h1>{{ route.query.name }}</h1>
    <WidgetsActivityRepeater />
  </div>
</template>

<script setup>
const route = useRoute()
</script>
