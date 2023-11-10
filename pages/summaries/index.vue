<template>
  <div class="summaries container mx-auto">
    <div class="heading flex justify-between">
      <h1 class="text-4xl font-extrabold">Summaries</h1>
    </div>
    <UiSeparator class="my-12" />
    <div v-if="data">
      <template v-for="(summary, i) in data">
        <NuxtLink
          :to="`/summaries/${summary.id}?content=${JSON.stringify(
            summary.content
          )}&created_at=${JSON.stringify(summary.created_at)}`"
        >
          <div
            class="w-full text-left dark:hover:bg-neutral-900 cursor-pointer p-3 border border-neutral bg-base-300 rounded-md mb-2"
          >
            {{ summary.title }}
          </div>
        </NuxtLink>
      </template>
    </div>
  </div>
</template>

<script setup>
const { data, pending, error } = useFetch('/api/summaries/getSummaries', {
  key: 'summaries',
})
</script>
