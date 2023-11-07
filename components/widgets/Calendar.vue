<template>
  <div class="calendar">
    <Calendar
      :selectionMode="handleSelectionMode"
      @update:modelValue="updateDateStore"
      inline
      v-model="date"
    />
  </div>
  <!-- multiple selection TODO -->
  <!-- <button @click="currentSelectionMode = modes.RANGE">change</button> -->
</template>
<script setup>
import { useSelectedDate } from '#imports'
const date = ref(null)

const modes = {
  SINGULAR: 'singular',
  RANGE: 'range',
}

const dateStore = useSelectedDate()

const currentSelectionMode = ref(modes.SINGULAR)

const handleSelectionMode = computed(() => {
  return currentSelectionMode.value === modes.RANGE ? 'range' : 'single'
})

const updateDateStore = (e) => {
  if (Array.isArray(e)) {
    if (e[1]) {
      dateStore.changeCurrentDate([e[0].toISOString(), e[1].toISOString()])
    }

    return
  }
  dateStore.changeCurrentDate(e.toISOString())
}
</script>
