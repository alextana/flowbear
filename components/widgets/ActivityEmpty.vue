<template>
  <div
    class="w-full h-[350px] prose mx-auto grid place-content-center text-center relative"
  >
    <GraphicsNoActivities class="w-5/6 h-5/6" />
    <h2 class="mt-0">
      {{ currentTitle }}
    </h2>
    <p>Use the add activity panel above to add an activity</p>
  </div>
</template>

<script setup>
import { useSelectedDate } from '#imports'
import { DateTime } from 'luxon'
const dateStore = useSelectedDate()

const computeTitle = () => {
  const d = DateTime.fromISO(dateStore?.currentDate).toFormat('dd MMM')
  return dateStore.isSelectedToday()
    ? 'No activities added for today'
    : `No activities added for ${d}`
}

const currentTitle = ref(props.title || computeTitle())

const props = defineProps({
  title: {
    type: String,
    default: ``,
  },
})
</script>
