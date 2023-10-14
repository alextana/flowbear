<template>
  <div v-if="pending">loading..</div>

  <div v-if="error">Error fetching activities</div>

  <div v-if="data" class="dates-activities-container">
    <div class="dates flex gap-4 mb-4" v-for="date in getDates(data.dates)">
      <div
        class="date-block min-w-[65px] min-h-[65px] text-center border border-white/50 h-max py-2 px-3 rounded-2xl"
      >
        <ClientOnly>
          <span class="day block text-2xl font-bold">
            {{ formatDate(date, 'day') }}
          </span>
          <span class="month block text-xs uppercase">
            {{ formatDate(date, 'month') }}
          </span>
        </ClientOnly>
      </div>
      <div class="activities w-[65ch]">
        <template v-for="(data, i) in data.activities">
          <template v-if="shouldShowDate(data.activity, date)">
            <div
              @mouseover="handleShowOptions(i)"
              @mouseleave="handleShowOptions(null)"
              class="activity-container w-full relative activity prose border-l-2 border-dotted transition-all pl-3 pr-5 mb-2 border-l-transparent hover:border-l-white/20"
            >
              <InputTipTap
                v-if="editingIndex === i"
                v-model="data.activity.content"
                autoFocus="end"
                @update:modelValue="handleEditing(data.activity)"
              />

              <div
                v-else
                @click="editingIndex = i"
                v-html="data.activity.content"
              />

              <div
                class="edit-actions absolute right-0 top-0"
                v-if="editIconsIndex === i"
              >
                <Icon
                  @click="handleDelete(data.activity)"
                  class="hover:text-purple-500 cursor-pointer"
                  name="mingcute:delete-line"
                  size="18"
                />
              </div>

              <div
                class="time-edit-container flex items-center justify-between"
              >
                <UiGoalSelector :activity="data.activity" :goals="data.goals" />

                <span class="w-full text-right text-xs text-white/40"
                  >at {{ getTime(data.activity.created_at) }}</span
                >
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>

  <UiModal id="delete_modal">
    <template #title> Deleting activity </template>
    <template #default> The activity will be lost, are you sure? </template>
    <template #buttons>
      <button @click="closeModal" class="btn btn-sm btn-ghost">cancel</button>
      <button class="btn btn-sm btn-error" @click="deleteActivity">
        Delete Activity
      </button>
    </template>
  </UiModal>
</template>

<script setup>
import { DateTime } from 'luxon'
import { getLang } from '~/helpers/getLang'
import { useDebounceFn } from '@vueuse/core'

const editIconsIndex = ref(null)
const editingIndex = ref(null)
const selectedActivity = ref(null)

const { data, pending, error } = useFetch('/api/activities/getActivities', {
  key: 'activities',
  transform(data) {
    const dates = data.map((d) => d.activity.created_at)
    return {
      activities: data,
      dates: dates,
    }
  },
})

const props = defineProps({
  limit: {
    type: Number,
    default: null,
  },
})

const getDates = (dates) => {
  return [
    ...new Set(
      dates.map((d) => {
        return DateTime.fromISO(d).toLocaleString()
      })
    ),
  ]
}

const getTime = (date) => {
  if (!date) return ''

  const formatted = DateTime.fromISO(date).toFormat('HH:mm')

  return formatted
}

const shouldShowDate = (activity, date) => {
  const activityDate = DateTime.fromISO(activity.created_at).toLocaleString()
  return activityDate === date
}

const formatDate = (date, stringFormat) => {
  const d = DateTime.fromFormat(date, 'MM/d/yyyy').setLocale(getLang())

  switch (true) {
    case stringFormat === 'day':
      return d.toLocaleString({
        day: '2-digit',
      })
    case stringFormat === 'month':
      return d.toLocaleString({
        month: 'short',
      })
  }
}

const handleShowOptions = (index) => {
  if (!index) {
    editIconsIndex.value = null
  }

  editIconsIndex.value = index
}

const handleDelete = (activity) => {
  selectedActivity.value = activity
  delete_modal.showModal()
}

const deleteActivity = () => {
  $fetch('/api/activities/deleteActivity', {
    method: 'POST',
    body: JSON.stringify(selectedActivity.value),
    onResponse() {
      refreshNuxtData('activities')
      closeModal()
    },
  })
}

// TODO - add optimisations to persist text
// debounce is cool but too many requests atm
// need to do things like check window blur, save when that happens (?)
// or if we detect too many requests happening slow them down
// by artificially upping debounce time?

const handleEditing = useDebounceFn((activity) => {
  // add a saving indicator
  $fetch('/api/activities/updateActivity', {
    method: 'POST',
    body: JSON.stringify(activity),
    onResponseError() {
      // TODO negate optimistic update
    },
    onResponse() {},
  })
}, 1000)

const closeModal = () => {
  delete_modal.close()
}
</script>

<style>
.activity-container .tiptap {
  padding: 0;
}
</style>
