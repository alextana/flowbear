<template>
  <div v-if="pending">loading..</div>

  <div v-if="error">Error fetching activities</div>

  <div v-if="data" class="dates-activities-container">
    <div class="dates flex gap-4 mb-4" v-for="date in getDates(data.dates)">
      <div
        class="date-block text-center border border-white/50 h-max py-2 px-3 rounded-2xl"
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
        <template v-for="(activity, i) in data.activities">
          <template v-if="shouldShowDate(activity, date)">
            <div
              @mouseover="handleShowOptions(i)"
              @mouseleave="handleShowOptions(null)"
              class="activity-container w-full relative"
            >
              <div
                class="activity prose border-l-2 border-dotted transition-all pl-3 pr-5 mb-2 border-l-transparent hover:border-l-white/30"
                v-html="activity.content"
              />

              <div
                class="edit-actions absolute right-0 top-0"
                v-if="editIconsIndex === i"
              >
                <Icon
                  @click="handleDelete(activity)"
                  class="hover:text-purple-500 cursor-pointer"
                  name="mingcute:delete-line"
                  size="18"
                />
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>

  <!-- TODO make it a component -->
  <dialog id="delete_modal" class="modal">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <h3 class="font-bold text-lg">Deleting activity</h3>
      <p class="py-4">The activity will be lost, are you sure?</p>
      <div class="buttons flex gap-2 justify-end">
        <button @click="closeModal" class="btn btn-sm btn-ghost">cancel</button>
        <button class="btn btn-sm btn-error" @click="deleteActivity">
          Delete Activity
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup>
import { DateTime } from 'luxon'
import { getLang } from '~/helpers/getLang'

const editIconsIndex = ref(null)
const selectedActivity = ref(null)

const { data, pending, error } = useFetch('/api/activities/getActivities', {
  key: 'activities',
  transform(data) {
    const dates = data.map((d) => d.created_at)

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

const closeModal = () => {
  delete_modal.close()
}
</script>
