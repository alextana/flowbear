<template>
  <div class="form-control w-full max-w-xs">
    <label v-if="props.label" class="label">
      <span class="label-text">{{ props.label }}</span>
    </label>
    <input
      ref="inputRef"
      v-bind="$attrs"
      type="text"
      :autofocus="props.autoFocus || null"
      :placeholder="props.placeHolder"
      :class="`${props.classes || 'input input-bordered w-full max-w-xs'}`"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
const inputRef = ref(null)
defineEmits(['update:modelValue'])
const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  classes: {
    type: String,
  },
  placeHolder: {
    type: String,
    default: 'Type here',
  },
  autoFocus: {
    type: Boolean,
  },
  modelValue: {
    type: String,
  },
})

onMounted(() => {
  if (inputRef.value && props.autoFocus) {
    inputRef.value.focus()
  }
})
</script>
