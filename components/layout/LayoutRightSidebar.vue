<template>
  <div class="grid grid-cols-1 px-4 sticky top-0">
    <div class="calendar">
      <Calendar inline v-model="date" />
    </div>
    <UiSeparator class="my-2" />
    <div>
      <div class="flex gap-2 justify-between items-center mb-4">
        <h4 class="text-2xl font-extrabold">Today's todos</h4>
        <div class="create-todo">
          <button
            @click="() => (addingTodo = !addingTodo)"
            :class="`btn btn-circle ${
              addingTodo ? 'btn-info' : 'btn-primary'
            } m-1`"
          >
            <Icon
              :class="`transition-all ${
                addingTodo ? 'transform rotate-[45deg]' : ''
              }`"
              name="material-symbols:add"
              size="22"
            />
          </button>
        </div>
      </div>
      {{ date }}
      <template v-if="pending">loading todos..</template>

      <!-- TODO (lol) make this into a component -->
      <div v-auto-animate>
        <template v-if="addingTodo">
          <div class="w-full flex gap-2 items-center mb-2">
            <input type="checkbox" :checked="false" class="checkbox" disabled />
            <UiInputText
              @keyup.enter.prevent.stop="handleAddTodo"
              :autoFocus="true"
              v-model="newTodo.title"
              classes="input input-sm input-bordered w-full"
            />
            <!-- <UiButton
              @click="handleAddTodo"
              size="sm"
              kind="primary"
              extra-classes="!rounded-lg"
              >Add</UiButton
            > -->
          </div>
        </template>

        <template v-if="data && data">
          <template :key="data" v-for="todo in data">
            <WidgetsTodoItem :todo="todo.todos" />
          </template>
        </template>
      </div>

      <template v-if="!data && !error">
        <div class="no-todos">No todos</div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useToast } from 'primevue/usetoast'
const toast = useToast()

const { data, pending, error } = useFetch('/api/todos/getTodos', {
  key: 'dailyTodos',
})

const date = ref(null)
const shouldShow = ref(false)
const addingTodo = ref(false)
const newTodo = ref({
  title: null,
  description: null,
})

const handleAddTodo = (e) => {
  $fetch('/api/todos/createTodo', {
    method: 'POST',
    body: JSON.stringify({
      title: newTodo.value.title,
      description: newTodo.description,
    }),
    onResponse() {
      newTodo.value = {
        title: null,
        description: null,
      }
      toast.add({
        severity: 'success',
        summary: 'Done',
        detail: 'Todo added',
        group: 'br',
        life: 3000,
      })

      refreshNuxtData('dailyTodos')

      addingTodo.value = false
    },
  })
}

onMounted(() => {
  shouldShow.value = true
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
