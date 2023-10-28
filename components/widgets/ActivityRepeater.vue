<template>
  <div v-if="pending">loading..</div>

  <div v-if="error">Error fetching activities</div>

  <div v-if="data" class="dates-activities-container">
    <div class="dates mb-4 flex gap-4" v-for="date in getDates(data.dates)">
      <div
        class="date-block h-max min-h-[65px] bg-base-100 min-w-[65px] rounded-2xl border border-neutral-content dark:border-neutral px-3 py-2 text-center"
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
      <div class="activities">
        <template v-for="(data, i) in data.activities">
          <template v-if="shouldShowDate(data.activity, date)">
            <div
              @mouseover="handleShowOptions(i)"
              @mouseleave="handleShowOptions(null)"
              class="activity-container p-4 rounded-2xl bg-base-100 activity prose max-w-none relative mb-2 w-full border dark:border-neutral border-neutral-content transition-all hover:border-l-neutral-content"
            >
              <InputTipTap
                v-if="editingIndex === i"
                v-model="data.activity.content"
                autoFocus="end"
                @update:modelValue="handleEditing(data.activity)"
                classProps="border-0 outline-0 focus:outline-0 focus:border-0"
              />

              <div
                v-else
                @click="editingIndex = i"
                v-html="data.activity.content"
              />

              <div
                class="edit-actions absolute right-4 top-2"
                v-if="editIconsIndex === i"
              >
                <Icon
                  @click="handleDelete(data.activity)"
                  class="cursor-pointer hover:text-accent"
                  name="mingcute:delete-line"
                  size="18"
                />
              </div>

              <div
                class="time-edit-container flex items-center justify-between"
              >
                <UiGoalSelector :activity="data.activity" :goals="data.goals" />

                <span class="w-full text-right text-xs text-base-content"
                  >at {{ getTime(data.activity.created_at) }}</span
                >
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>

  <div v-if="!data?.activities?.length && !pending">No activities found</div>

  <UiModal id="delete_modal">
    <template #title> Deleting activity </template>
    <template #default> The activity will be lost, are you sure? </template>
    <template #buttons>
      <button @click="closeModal" class="btn btn-ghost btn-sm">cancel</button>
      <button class="btn btn-error btn-sm" @click="deleteActivity">
        Delete Activity
      </button>
    </template>
  </UiModal>
</template>

<script setup>
import { DateTime } from 'luxon'
import { getLang } from '~/helpers/getLang'
import { useDebounceFn } from '@vueuse/core'

const route = useRoute()
const editIconsIndex = ref(null)
const editingIndex = ref(null)
const selectedActivity = ref(null)

const { data, pending, error } = useFetch('/api/activities/getActivities', {
  key: props.queryKey,
  params: {
    goalId: route.params.id || null,
    date: props.date,
  },
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
  queryKey: {
    type: String,
    default: 'activities',
  },
  date: {
    type: String,
    default: '',
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
      refreshNuxtData(props.queryKey)
      refreshNuxtData('activityCount')
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
