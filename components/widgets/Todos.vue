<template>
  <div
    class="todos-container relative overflow-hidden bg-base-100 rounded-2xl pl-6 pb-6 pr-6"
  >
    <div
      class="flex sticky pt-6 z-20 bg-base-100 top-0 gap-2 justify-between items-center mb-4"
    >
      <h4 class="text-2xl font-extrabold tracking-tighter">
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
              addingTodo ? 'transform rotate-[225deg]' : ''
            }`"
            name="material-symbols:add"
            size="24"
          />
        </button>
      </div>
    </div>
    <div
      v-auto-animate
      class="content-container min-h-[276px] max-h-[400px] overflow-y-auto overflow-x-hidden"
    >
      <template v-if="addingTodo">
        <div
          class="w-full flex sticky top-0 gap-2 bg-base-100 z-[20] items-center mb-2 px-2 py-1"
        >
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
        <template :key="group" v-for="group in data">
          <span
            v-if="group && group.goal"
            class="text-sm block mt-4 mb-2 font-semibold text-gray-700 dark:text-gray-300"
            >{{ group?.goal?.title }}</span
          >
          <template :key="todo" v-for="todo in group.todos">
            <WidgetsTodoItem
              :todo="todo"
              :goal="group.goal"
              @editTodo="(todo, goal) => handleEdit(todo, goal)"
              @deleteTodo="handleDeleteTodo"
            />
          </template>
        </template>
      </template>
      <template v-if="!data?.length && !error && !shouldShowLoading">
        <WidgetsTodosEmpty
          @adding="addingTodo = true"
          :addingTodo="addingTodo"
        />
      </template>
      <template v-else-if="error">
        {{ error }}
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
          :allGoals="allGoals"
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
        <button class="btn btn-sm btn-neutral" @click="close">Close</button>
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

const { data: allGoals } = useFetch('/api/goals/getGoals', {
  key: 'goals',
})

// only add loading state
// if it's taking long (500ms +)
const { data, pending, error } = useAsyncData(
  'dailyTodos',
  () =>
    $fetch('/api/todos/getGroupedTodos', {
      params: {
        date: dateStore?.currentDate || new Date(),
      },
    }),
  {
    watch: [dateStore],
    server: false,
    lazy: true,
  }
)
const { shouldShowLoading } = useLoading(pending, 750)

const getTodoTitle = computed(() => {
  const current = dateStore.currentDate
  if (Array.isArray(current)) {
    return `Todos ${current[1] ? 'between' : 'for'} ${DateTime.fromISO(
      current[0]
    ).toFormat('dd MMM')} ${
      current[1] ? 'and ' + DateTime.fromISO(current[1]).toFormat('dd MMM') : ''
    }`
  }

  const today = new Date()
  const d = dateStore.currentDate ? new Date(dateStore.currentDate) : new Date()
  today.setHours(0, 0, 0, 0)
  d.setHours(0, 0, 0, 0)

  if (today.toISOString() === d.toISOString()) {
    return `Today's Todos`
  }

  return `Todos for ${DateTime.fromISO(
    useGetISOStringFromDate(dateStore?.currentDate)
  ).toFormat('dd MMM')}`
})

onMounted(() => {
  shouldShow.value = true
})

const addingTodo = ref(false)
const newTodo = ref({
  title: null,
  description: null,
})

const handleAddTodo = () => {
  $fetch('/api/todos/createTodo', {
    method: 'POST',
    body: JSON.stringify({
      title: newTodo.value.title,
      description: newTodo.description,
      createdAt: dateStore.currentDate || new Date(),
    }),
    onResponse({ response }) {
      if (response.status !== 200) return

      newTodo.value = {
        title: null,
        description: null,
      }

      const toAdd = {
        goal: { title: 'No goal' },
        todos: [response._data.todo[0]],
      }

      // find the index of 'no goals'
      const idx = data.value.findIndex(
        (f) => f.goal.title.toLowerCase() === 'no goal'
      )

      if (idx === -1) {
        data.value = [toAdd, ...data.value]
      } else {
        data.value[idx].todos.unshift(response._data.todo[0])
      }

      toast.add({
        severity: 'success',
        summary: 'Done',
        detail: 'Todo added',
        group: 'bl',
        life: 3000,
      })

      refreshNuxtData('todosPage')
    },
    onResponseError({ error }) {
      console.error(error)

      refreshNuxtData('dailyTodos')
    },
  })
}

const handleEdit = (todo, goal) => {
  currentTodo.value = todo
  goal.title.toLowerCase() !== 'no goal'
    ? (todoGoal.value = goal)
    : (todoGoal.value = null)

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
  todoGoal.value = null
  todo_modal.close()
}

const handleDeleteTodo = (todo) => {
  const todoIdToRemove = todo.id

  for (const group of data.value) {
    group.todos = group.todos.filter((todo) => todo.id !== todoIdToRemove)

    if (!group.todos.length) {
      // If the todo array is empty, remove the goal
      const index = data.value.indexOf(group)
      data.value.splice(index, 1)
    }
  }
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
