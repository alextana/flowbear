<template>
  <div
    class="w-full mb-2 flex gap-2 items-center border-b dark:border-neutral-content/10 border-neutral-content pb-2"
  >
    <input
      type="checkbox"
      @change="handleTodoState"
      v-model="currentTodo.completed"
      :checked="currentTodo.completed"
      class="checkbox"
    />
    <UiInputText
      @focus="editing = true"
      @blur="editing = false"
      v-model="currentTodo.title"
      @update:modelValue="handleEditing"
      :classes="`input input-sm w-full ${
        editing ? 'input-bordered' : 'input-ghost'
      }`"
    />
  </div>
</template>

<script setup>
import { useDebounceFn } from '@vueuse/core'

const currentTodo = reactive(props.todo)
const editing = ref(false)
const props = defineProps({
  todo: {
    type: Object,
    default: null,
  },
})

const updateFn = (timeout = 1000) =>
  useDebounceFn(() => {
    // add a saving indicator
    $fetch('/api/todos/updateTodo', {
      method: 'POST',
      body: JSON.stringify(currentTodo),
      onResponseError() {
        // TODO negate optimistic update
      },
      onResponse() {},
    })
  }, timeout)

const handleEditing = updateFn()
const handleTodoState = updateFn(0)
</script>
