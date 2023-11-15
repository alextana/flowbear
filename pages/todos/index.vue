<template>
  <div class="todos">
    <div class="heading flex justify-between">
      <h1 class="text-4xl font-extrabold tracking-tighter">Todos</h1>
      <UiButton @click="handleModalOpen" kind="primary" class="add-new"
        >Create todo
        <!-- todo add shortcut and windows/mac detection
        <span class="keys text-xs"
          ><kbd class="kbd text-neutral-content">⌘</kbd> +
          <kbd class="kbd text-neutral-content">n</kbd></span
        >       -->
      </UiButton>
    </div>
    <UiSeparator class="my-8" />

    <template v-if="!data?.length && !error && !shouldShowLoading">
      <WidgetsTodosEmpty @adding="addingTodo = true" :addingTodo="addingTodo" />
    </template>

    <div v-for="todo in data">
      <div
        class="w-full text-left flex items-center relative gap-3 bg-gradient-to-br from-transparent to-primary/10 hover:bg-base-300 cursor-pointer p-5 border border-base-300 rounded-2xl mb-3"
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
const router = useRouter()
const { currentRoute } = router
const formData = ref(null)
const toast = useToast()

const { data, pending, error } = useFetch('/api/todos/getTodos', {
  key: 'todosPage',
  params: {
    orderBy: '',
  },
})

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

const submitHandler = (data) => {
  const res = new Promise((resolve, reject) => {
    $fetch('/api/todos/createTodo', {
      method: 'POST',
      immediate: false,
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        created_at: new Date(),
        goalId: data.goals,
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
        refreshNuxtData('todosPage')
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
