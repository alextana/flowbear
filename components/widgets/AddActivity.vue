<template>
  <div class="w-full prose">
    <h1>Hello, what did you do today?</h1>
    <InputTipTap v-model="activityContent" />
    <UiSeparator class="mb-4" />
    <div class="flex actions">
      <UiButton @click="toSend = activityContent" class="ml-auto" kind="primary"
        >Add activity</UiButton
      >
    </div>
  </div>
</template>

<script setup>
const activityContent = ref('')
const toSend = ref('')

const { data, pending, error, refresh, execute } = await useFetch(
  '/api/activities/createActivity',
  {
    immediate: false,
    body: { content: toSend },
    method: 'PUT',
    onResponse() {
      refreshNuxtData('activities')
    },
  }
)
</script>
