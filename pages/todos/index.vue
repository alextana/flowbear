<template>
  <div class="todos container mx-auto">
    <div class="heading flex justify-between">
      <h1 class="text-4xl font-extrabold tracking-tighter">Todos</h1>
    </div>
    <UiSeparator class="my-8" />

    <template v-for="todo in data">
      <div
        class="w-full text-left flex items-center relative gap-3 bg-gradient-to-br from-transparent to-primary/10 hover:bg-base-300 cursor-pointer p-3 border border-base-300 rounded-md mb-3"
        :class="`${todo.todos.completed ? 'opacity-50' : ''}`"
      >
        <div class="edit absolute right-2 top-2">
          <Icon name="tabler:dots" size="18" />
        </div>
        <div class="check">
          <input
            type="checkbox"
            @change="() => handleTodoState(todo.todos)"
            v-model="todo.todos.completed"
            :checked="todo.todos.completed"
            class="checkbox z-[10] checkbox-primary"
          />
        </div>
        <div class="title-desc">
          <span class="block text-lg">{{ todo.todos.title }}</span>
          <span class="block text-neutral dark:text-white/60">{{
            todo.todos.description
          }}</span>
        </div>
        <!-- {{ todo }} -->
      </div>
    </template>
  </div>
</template>

<script setup>
const { data, pending, error } = useFetch('/api/todos/getTodos', {
  params: {
    orderBy: '',
  },
})

const handleTodoState = (todo) => {
  const newTodo = { ...todo }
  $fetch('/api/todos/updateTodo', {
    method: 'POST',
    body: JSON.stringify(newTodo),
    onResponseError({ response }) {
      console.log(response)
      // TODO negate optimistic update
    },
    onResponse({ response }) {
      if (response.status !== 200) return
    },
  })
}
</script>
