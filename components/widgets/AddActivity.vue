<template>
  <div class="w-full prose">
    <h1 class="text-lg font-normal">Hello, what did you do today?</h1>
    <InputTipTap
      v-model="activityContent"
      class-props="mt-8 prose prose-slate w-full min-w-full mx-auto prose-base"
    />
    <UiSeparator class="mb-4" />
    <div class="flex actions">
      <UiButton @click="handleAdd" class="ml-auto" kind="primary"
        >Add activity</UiButton
      >
    </div>
  </div>
</template>

<script setup>
const activityContent = ref('')

const handleAdd = () => {
  $fetch('/api/activities/createActivity', {
    body: { content: activityContent.value },
    method: 'PUT',
    onResponse() {
      activityContent.value = ''
      refreshNuxtData('activities')
    },
  })
}
</script>
