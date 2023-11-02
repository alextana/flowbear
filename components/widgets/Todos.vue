<template>
  <div
    class="todos-container overflow-hidden bg-base-200/70 dark:bg-base-200 rounded-2xl p-6"
  >
    <div class="flex gap-2 justify-between items-center mb-4">
      <h4 class="text-2xl font-extrabold">
        {{ getTodoTitle }}
      </h4>
      <div class="create-todo">
        <button
          @click="() => (addingTodo = !addingTodo)"
          :class="`btn btn-xl btn-circle ${
            addingTodo ? 'btn-neutral text-neutral-content' : 'btn-primary'
          } m-1`"
        >
          <Icon
            :class="`transition-all ${
              addingTodo ? 'transform rotate-[45deg]' : ''
            }`"
            name="material-symbols:add"
            size="24"
          />
        </button>
      </div>
    </div>
    <div v-auto-animate class="content-container">
      <template v-if="addingTodo">
        <div class="w-full flex gap-2 items-center mb-2 relative px-2 py-1">
          <input type="checkbox" :checked="false" class="checkbox" disabled />
          <UiInputText
            @keyup.enter.prevent.stop="handleAddTodo"
            :autoFocus="true"
            placeHolder="Your todo title"
            v-model="newTodo.title"
            classes="input input-sm input-bordered w-full"
          />
          <UiButton
            @click="handleAddTodo"
            size="sm"
            kind="primary"
            extra-classes="!rounded-lg"
            ><Icon name="material-symbols:add" size="18"
          /></UiButton>
        </div>
      </template>
      <template v-if="shouldShowLoading && !data?.length">
        <div class="grid place-content-center">
          <span class="loading loading-ball loading-lg"></span>
        </div>
      </template>
      <template :key="data" v-else-if="data && data?.length">
        <template :key="todo" v-for="todo in data">
          <WidgetsTodoItem
            :todo="todo"
            @editTodo="(todo, goal) => handleEdit(todo, goal)"
            @deleteTodo="handleDeleteTodo"
          />
        </template>
      </template>
      <template v-if="!data?.length && !error && !shouldShowLoading">
        <WidgetsTodosEmpty
          @adding="addingTodo = true"
          :addingTodo="addingTodo"
        />
      </template>
      <template v-else-if="error">
        <div>Error getting todos..</div>
      </template>
    </div>
  </div>
  <UiModal id="todo_modal">
    <template #title>
      <span>Edit todo</span>
    </template>
    <template #default>
      <div class="todo-edit">
        <UiInputText label="Todo title" v-model="currentTodo.title" />
        <UiSeparator class="my-4" />
        <UiTextArea
          label="Todo description"
          v-model="currentTodo.description"
        />
        <UiSeparator class="my-4" />
        <UiGoalDropdown
          v-if="!todoGoal"
          direction="top"
          @addGoal="($event) => handleAddGoal($event)"
        >
          <button
            :class="`btn btn-sm transition-all duration-500 transform m-1 ${
              buttonError
                ? 'btn-error text-error-content scale-[1.10]'
                : 'btn-outline scale-[1]'
            }`"
          >
            Add Goal
            <label>
              <Icon
                :class="`transition-transform duration-300 transform ${
                  buttonError ? 'rotate-[45deg]' : 'rotate-0 '
                }`"
                name="material-symbols:add"
                size="18"
              />
            </label>
          </button>
        </UiGoalDropdown>
        <button class="btn btn-sm btn-success flex gap-2" v-else>
          <span>{{ todoGoal.title }}</span>
          <Icon
            @click="handleRemoveGoal(todoGoal)"
            name="mdi:remove"
            size="18"
          />
        </button>
      </div>
    </template>

    <template #buttons>
      <div class="w-full justify-end flex gap-2">
        <button @click="handleCancel" class="btn btn-sm btn-ghost">
          cancel
        </button>
        <button class="btn btn-sm btn-success" @click="close">Close</button>
      </div>
    </template>
  </UiModal>
  <Toast position="bottom-left" group="bl" />
</template>

<script setup>
import { useSelectedDate } from '#imports'
import { DateTime } from 'luxon'

import { useToast } from 'primevue/usetoast'
const toast = useToast()
const dateStore = useSelectedDate()
const shouldShow = ref(false)

const buttonError = ref(false)

const todoGoal = ref(null)

const currentTodo = ref({
  title: '',
  description: '',
})

const { data, pending, error } = useAsyncData(
  'dailyTodos',
  () =>
    $fetch('/api/todos/getTodos', {
      params: {
        date: dateStore?.currentDate || null,
      },
    }),
  {
    watch: [dateStore],
    server: false,
    lazy: true,
  }
)

// only add loading state
// if it's taking long (500ms +)
const { shouldShowLoading } = useLoading(pending, 750)

const getTodoTitle = computed(() => {
  const today = new Date()
  const d = new Date(dateStore.currentDate)
  today.setHours(0, 0, 0, 0)
  d.setHours(0, 0, 0, 0)

  if (today.toISOString() === d.toISOString()) {
    return `Today's Todos`
  }
  return `Todos for ${DateTime.fromISO(dateStore?.currentDate).toFormat(
    'dd MMM'
  )}`
})

onMounted(() => {
  shouldShow.value = true
})

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
    onResponse({ response }) {
      if (response.status !== 200) return

      newTodo.value = {
        title: null,
        description: null,
      }

      data.value = [
        { todos: response._data.todo[0], goals: [null], todo_to_goal: null },
        ...data.value,
      ]

      toast.add({
        severity: 'success',
        summary: 'Done',
        detail: 'Todo added',
        group: 'bl',
        life: 3000,
      })

      // addingTodo.value = false
    },
    onResponseError({ error }) {
      console.error(error)

      refreshNuxtData('dailyTodos')
    },
  })
}

const handleEdit = (todo, goal) => {
  currentTodo.value = todo

  todoGoal.value = goal

  todo_modal.showModal()
}

const setButtonError = () => {
  buttonError.value = true

  setTimeout(() => {
    buttonError.value = false
  }, 1200)
}

const handleRemoveGoal = (goal) => {
  document.activeElement.blur()

  $fetch('/api/goals/removeGoal', {
    method: 'POST',
    body: JSON.stringify({
      goalId: goal.goalId,
      todoId: currentTodo.value.id,
    }),
    onResponse({ response }) {
      if (response.status !== 200) return
      todoGoal.value = null

      refreshNuxtData('dailyTodos')
    },
    onResponseError() {
      setButtonError()
    },
  })
}

const handleAddGoal = (goal) => {
  if (currentTodo?.value?.goalId === goal.goalId) {
    setButtonError()

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Cannot add duplicate goals',
      group: 'br',
      life: 3000,
    })

    document.activeElement.blur()

    return
  }
  $fetch('/api/goals/addGoal', {
    method: 'POST',
    body: JSON.stringify({
      goalId: goal.goalId,
      todoId: currentTodo.value.id,
    }),
    onResponse({ response }) {
      if (response.status !== 200) return

      todoGoal.value = goal
      refreshNuxtData('dailyTodos')

      // toggles dropdown
      document.activeElement.blur()
    },
    onResponseError() {
      setButtonError()
    },
  })
}

const close = () => {
  todo_modal.close()
}

const handleDeleteTodo = (todo) => {
  data.value = data.value.filter((f) => f.todos.id !== todo.id)
}
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
