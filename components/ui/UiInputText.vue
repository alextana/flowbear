<template>
  <div class="form-control w-full max-w-xs">
    <label v-if="props.label" class="label">
      <span class="label-text">{{ props.label }}</span>
    </label>
    <input
      type="text"
      :placeholder="props.placeHolder"
      class="input input-bordered w-full max-w-xs"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineEmits(['update:modelValue'])
const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  placeHolder: {
    type: String,
    default: 'Type here',
  },
  modelValue: {
    type: String,
  },
})
</script>
