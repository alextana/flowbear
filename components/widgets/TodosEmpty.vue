<template>
  <div
    v-if="!props.addingTodo"
    class="no-todos relative w-[370px] h-[276px] grid place-content-center"
  >
    <div class="no-todos text-center z-[2]">
      <h4 class="text-2xl font-bold">Nothing to see here</h4>
      <p class="mb-4 mt-0">what do you need to do today?</p>
      <UiButton @click="$emit('adding')" kind="primary">Add a todo</UiButton>
      <GraphicsNoTodos
        class="pointer-events-none w-5/6 h-5/6 absolute right-0 bottom-0 opacity-10 z-[-1]"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  addingTodo: {
    type: Boolean,
  },
})
</script>
