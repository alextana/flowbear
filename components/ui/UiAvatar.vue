<template>
  <div class="avatar">
    <div class="w-12 mask mask-squircle">
      <img :src="props.url" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  mask: {
    type: String,
    default: '',
  },
  width: {
    type: [String, Number],
    default: '',
  },
  url: {
    type: String,
    default: '',
    required: true,
  },
})
</script>
