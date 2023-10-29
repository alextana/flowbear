<template>
  <div class="calendar">
    <Calendar
      :selectionMode="handleSelectionMode"
      @update:modelValue="updateDateStore"
      inline
      v-model="date"
    />
  </div>
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
  dateStore.changeCurrentDate(e.toISOString())
}
</script>
