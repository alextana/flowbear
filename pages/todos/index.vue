<template>
  <div class="todos">
    <div class="heading flex justify-between">
      <h1 class="text-4xl font-extrabold tracking-tighter">Todos</h1>
      <UiButton @click="handleModalOpen" kind="primary" class="add-new"
        >Create todo
      </UiButton>
    </div>
    <UiSeparator class="my-8" />

    <template v-if="!data?.todos?.length && !error && !shouldShowLoading">
      <WidgetsTodosEmpty @adding="addingTodo = true" :addingTodo="addingTodo" />
    </template>

    <div ref="todoContainer" class="todos-body">
      <div v-for="todo in data?.todos">
        <div
          class="w-full text-left flex items-center relative gap-3 bg-gradient-to-br from-transparent to-primary/10 hover:bg-base-300 cursor-pointer p-5 border border-base-300 rounded-2xl mb-3"
          :class="`${todo.completed ? 'opacity-50' : ''}`"
        >
          <div class="edit absolute right-2 top-2">
            <UiDropdown
              :list="actions"
              nameKey="name"
              @change="(e) => handleAction(e, todo)"
              :dropdownLabel="'Edit Todo'"
            >
              <template #label>
                <UiButton kind="ghost" size="sm">
                  <Icon name="tabler:dots" size="18" />
                </UiButton>
              </template>
            </UiDropdown>
          </div>
          <div class="check">
            <input
              type="checkbox"
              @change="() => handleTodoState(todo)"
              v-model="todo.completed"
              :checked="todo.completed"
              class="checkbox z-[10] checkbox-primary"
            />
          </div>
          <div class="title-desc">
            <span class="block text-lg">{{ todo.title }}</span>
            <span class="block text-neutral dark:text-white/60">{{
              todo.description
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <UiModal @close="useQueryRoute('remove', 'todo_modal_open')" id="add_todo">
    <template #title> Add todo </template>
    <template #default>
      <FormKit
        id="todo-form"
        @submit="submitHandler"
        type="form"
        :submit-attrs="{
          inputClass: 'btn btn-success',
        }"
        submit-label="Add todo"
        v-model="formData"
      >
        <FormKit
          id="title-input"
          validation="required:trim|length:0, 50"
          type="text"
          name="title"
          label="Title"
        />
        <FormKit type="textarea" name="description" label="Description" />

        <template v-if="goalData?.length">
          <FormKit
            type="select"
            name="goals"
            placeholder="Select a goal"
            label="Goal"
            :options="formatGoalData"
          />
        </template>
      </FormKit>
    </template>
  </UiModal>
  <Toast position="bottom-right" group="br" />
</template>

<script setup>
import { useToast } from 'primevue/usetoast'
import { reset } from '@formkit/core'

const todoContainer = ref(null)
const router = useRouter()
const { currentRoute } = router
const formData = ref(null)
const pageOffset = ref(0)
const pageLimit = ref(20)
const toast = useToast()

const { data, pending, error } = useFetch('/api/todos/getTodos', {
  key: 'todosPage',
  params: {
    limit: pageLimit.value,
    offset: pageOffset.value,
    orderBy: '',
  },
})

const fetchMoreTodos = async () => {
  pageOffset.value += pageLimit.value
  const res = await $fetch('/api/todos/getTodos', {
    params: {
      limit: pageLimit.value,
      offset: pageOffset.value,
    },
  })

  data.value = data.value.concat(res)
}

const handleDelete = (todo) => {
  $fetch('/api/todos/deleteTodo', {
    method: 'POST',
    body: JSON.stringify({
      id: todo.todos.id,
    }),
    onResponse({ response }) {
      if (response.status !== 200) return
      data.value = data.value.filter((f) => f.todos.id !== todo.todos.id)
      toast.add({
        severity: 'success',
        summary: 'Done',
        detail: 'Todo deleted',
        group: 'br',
        life: 3000,
      })
    },
    onResponseError({ response }) {
      toast.add({
        severity: 'error',
        summary: 'Oh no!',
        detail: response._data.statusMessage,
        group: 'br',
        life: 5000,
      })
    },
  })
}

const handleEdit = (todo) => {
  console.log('edit', todo)
}

const actions = [
  // {
  //   name: 'Edit',
  // },
  {
    name: 'Delete',
  },
]

const handleAction = (element, todo) => {
  switch (true) {
    case element.name === 'Edit':
      handleEdit(todo)
      break
    case element.name === 'Delete':
      handleDelete(todo)
      break
  }
}

const { data: goalData } = useFetch('/api/goals/getGoals')

const formatGoalData = computed(() => {
  if (!goalData.value || !goalData.value.length) return []

  return [...goalData.value].map((m) => {
    return {
      label: m.title,
      value: m.goalId.toString(),
    }
  })
})

const handleTodoState = (todo) => {
  const newTodo = { ...todo }
  $fetch('/api/todos/updateTodo', {
    method: 'POST',
    body: JSON.stringify(newTodo),
    onResponseError({ response }) {},
    onResponse({ response }) {
      if (response.status !== 200) return
    },
  })
}

onMounted(async () => {
  if (!!currentRoute.value.query.todo_modal_open) {
    add_todo.showModal()
    await nextTick()
    useFocus('title-input')
  }
})

const submitHandler = (formData) => {
  const res = new Promise((resolve, reject) => {
    $fetch('/api/todos/createTodo', {
      method: 'POST',
      immediate: false,
      body: JSON.stringify({
        title: formData.title,
        description: formData.description,
        created_at: new Date(),
        goalId: formData.goals,
      }),
      async onResponse({ response }) {
        if (response.status !== 200) {
          reject(new Error(response._data.statusMessage))
          return
        }
        add_todo.close()
        toast.add({
          severity: 'success',
          summary: 'Todo created',
          detail: 'Your todo was created successfully',
          group: 'br',
          life: 5000,
        })
        resolve(response)
        data.value = [
          {
            todos: response._data.todos[0],
            todo_to_goals: response._data.todo_to_goals,
            goals: response._data.goals,
          },
          ...data.value,
        ]
        console.log('post', data.value)
        refreshNuxtData('dailyTodos')
      },
      onResponseError({ response }) {
        toast.add({
          severity: 'error',
          summary: 'Oh no!',
          detail: response._data.statusMessage,
          group: 'br',
          life: 5000,
        })

        reject(new Error(response._data.statusMessage))
        return
      },
    })
  })
  return res.then(() => res).catch((error) => console.error(error))
}

const handleModalOpen = () => {
  add_todo.showModal()
  useQueryRoute('add', 'todo_modal_open', 'true')
  useFocus('title-input')
}

const closeModal = () => {
  add_todo.close()
  reset('todo-form')
}
</script>
