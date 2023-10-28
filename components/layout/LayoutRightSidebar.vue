<template>
  <div class="grid grid-cols-1 px-4 sticky top-5">
    <div class="calendar">
      <Calendar :selectionMode="handleSelectionMode" inline v-model="date" />
    </div>

    <UiSeparator class="my-2" />
    <WidgetsTodos />
  </div>
</template>

<script setup>
const date = ref(null)

const modes = {
  SINGULAR: 'singular',
  RANGE: 'range',
}

const currentSelectionMode = ref(modes.SINGULAR)

const handleSelectionMode = computed(() => {
  return currentSelectionMode.value === modes.RANGE ? 'range' : 'single'
})
</script>
