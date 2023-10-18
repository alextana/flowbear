<template>
  <div class="grid grid-cols-1 px-4">
    <div class="calendar">
      <Calendar inline v-model="date" />
    </div>
    <UiSeparator class="my-2" />
    <div>
      <h4 class="text-2xl font-extrabold">Today's activities</h4>
      {{ date }}
    </div>
  </div>
</template>

<script setup>
const date = ref(null)
const shouldShow = ref(false)

onMounted(() => {
  shouldShow.value = true
})
</script>
