<template>
  <div class="summaries container mx-auto">
    <div class="heading flex justify-between">
      <h1 class="text-4xl font-extrabold">Summaries</h1>
    </div>
    <UiSeparator class="my-12" />
    <div v-if="data">
      <template v-for="(summary, i) in data">
        <NuxtLink
          :to="`/summaries/${summary.id}?title=${JSON.stringify(
            summary.title
          )}&content=${JSON.stringify(
            summary.content
          )}&created_at=${JSON.stringify(summary.created_at)}`"
        >
          <div
            class="w-full text-left flex items-center justify-between gap-3 bg-gradient-to-br from-transparent to-primary/10 hover:bg-base-300 cursor-pointer p-3 border border-base-300 rounded-md mb-3"
          >
            <div class="title-desc w-full">
              <div class="title mb-2 flex gap-2 justify-between items-center">
                <div class="main-title">
                  <span class="block text-lg">{{ summary.title }}</span>
                  <span
                    class="block text-sm text-neutral/80 dark:text-white/60"
                    >{{ summary.description }}</span
                  >
                </div>
                <div class="dates text-sm">
                  {{ getDate(summary) }}
                </div>
              </div>

              <div class="desc w-full items-center flex gap-2 justify-between">
                <span
                  v-if="summary.ai_generated"
                  class="ai-gen bg-gradient-to-br from-blue-500 to-cyan-500 font-bold text-white px-2 py-1 rounded-md text-[.6rem] uppercase"
                >
                  generated with AI</span
                >
                <div class="text-xs self-end ml-auto">
                  at {{ useDateTime(summary.created_at) }}
                </div>
              </div>
            </div>
          </div>
        </NuxtLink>
      </template>
    </div>
  </div>
</template>

<script setup>
import { DateTime } from 'luxon'

const { data, pending, error } = useFetch('/api/summaries/getSummaries', {
  key: 'summaries',
})

const getDate = (summary) => {
  if (!summary.dates) {
    return ''
  }

  const d = JSON.parse(summary.dates)
  return (
    DateTime.fromISO(d.startDate).toFormat('dd MMM') +
    ' - ' +
    DateTime.fromISO(d.endDate).toFormat('dd MMM yy')
  )
}
</script>
