<template>
  <div class="calendar disable-selection">
    <Calendar
      :selectionMode="currentSelectionMode"
      @update:modelValue="updateDateStore"
      inline
      v-model="date"
      ><template #footer>
        <div class="toggle-selection flex justify-end">
          <div class="w-max">
            <label class="label cursor-pointer flex gap-2 items-center">
              <span class="label-text">Range selection</span>
              <input type="checkbox" class="toggle" v-model="selection" />
            </label>
          </div>
        </div>
      </template>
    </Calendar>
  </div>
</template>
<script setup>
import { useSelectedDate } from '#imports'
const date = ref(null)

const modes = {
  SINGULAR: 'single',
  RANGE: 'range',
}

const selection = ref(false)

watch(selection, (prevValue) => {
  date.value = null

  prevValue
    ? (currentSelectionMode.value = modes.RANGE)
    : (currentSelectionMode.value = modes.SINGULAR)
})

const dateStore = useSelectedDate()

const currentSelectionMode = ref(modes.SINGULAR)

const updateDateStore = (date) => {
  if (Array.isArray(date)) {
    const newDate = date.map((d) => (d ? d.toISOString() : null))

    dateStore.changeCurrentDate(newDate)
    return
  }
  dateStore.changeCurrentDate(date.toISOString())
}
</script>
