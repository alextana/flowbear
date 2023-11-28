<template>
  <div class="summaries">
    <div class="heading flex justify-between">
      <h1 class="text-xl font-semibold tracking-tighter">Summaries</h1>
      <UiButton kind="primary" @click="handleCreate">Create summary</UiButton>
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
            class="w-full text-left flex items-center justify-between gap-3 dark:hover:bg-base-300 dark:hover:text-white hover:bg-base-200 bg-gradient-to-br from-transparent to-base-300 cursor-pointer p-3 border border-base-300 dark:border-neutral/50 rounded-md mb-3"
          >
            <div class="title-desc w-full">
              <div class="title mb-2 flex gap-2 justify-between items-center">
                <div class="main-title">
                  <div class="title flex gap-2 items-center">
                    <span class="block text-md">{{ summary.title }} </span>
                    <UiAiBadge v-if="summary.ai_generated" />
                  </div>
                  <span
                    class="block text-sm text-neutral/80 dark:text-white/60"
                    >{{ summary.description }}</span
                  >
                </div>
                <div class="dates text-xs">
                  {{ getDate(summary) }}
                </div>
              </div>

              <div class="desc w-full items-center flex gap-2 justify-between">
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
  <UiModal id="summary">
    <template #title> Create summary </template>
    <template #default> show calendar here </template>
    <!-- <template #buttons>
      <button @click="closeModal" class="btn btn-ghost btn-sm">cancel</button>
      <button class="btn btn-error btn-sm" @click="deleteGoal">
        Delete Goal
      </button>
    </template> -->
  </UiModal>
</template>

<script setup>
import { DateTime } from 'luxon'

const { data, pending, error } = useFetch('/api/summaries/getSummaries', {
  key: 'summaries',
})

const handleCreate = () => {
  summary.showModal()
  useQueryRoute('add', 'summary_modal_open', 'true')
}

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
