<template>
  <div class="w-full min-w-[71ch] prose">
    <h1 class="text-lg font-normal">Hello, what did you do today?</h1>
    <InputTipTap
      v-model="activityContent"
      classProps="mt-8 min-h-[125px] border border-base-300 prose prose-slate w-full min-w-full mx-auto prose-base"
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
