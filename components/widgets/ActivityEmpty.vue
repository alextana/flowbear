<template>
  <div
    class="w-full h-[350px] prose max-w-none grid place-content-center text-center relative"
  >
    <GraphicsNoActivities class="w-5/6 h-5/6" />
    <h2 class="mt-0">
      {{ title }}
    </h2>
    <p>Use the add activity panel above to add an activity</p>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: 'No activities added for today',
  },
})
</script>
