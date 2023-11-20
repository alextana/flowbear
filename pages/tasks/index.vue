<template>
  <div class="tasks">
    <div class="heading flex justify-between">
      <h1 class="text-xl font-semibold tracking-tighter">Tasks</h1>
      <UiButton @click="handleModalOpen" kind="primary" class="add-new"
        >Create task
      </UiButton>
    </div>
    <UiSeparator class="my-8" />

    <template v-if="!data?.tasks?.length && !error && !shouldShowLoading">
      <WidgetsTasksEmpty @adding="addingTask = true" :addingTask="addingTask" />
    </template>

    <div v-auto-animate ref="taskContainer" class="tasks-body">
      <div v-for="task in data?.tasks">
        <div
          class="w-full text-left flex items-center rounded-none relative gap-3 hover:bg-base-300 cursor-pointer px-5 py-3 border-b border-base-300"
          :class="`${task.completed ? 'opacity-50' : ''}`"
          @click="handleTaskClick"
        >
          <div class="edit absolute right-2 top-2">
            <UiDropdown
              :list="actions"
              nameKey="name"
              @change="(e) => handleAction(e, task)"
              :dropdownLabel="'Edit Task'"
            >
              <template #label>
                <UiButton kind="ghost" size="sm">
                  <Icon name="tabler:dots" size="18" />
                </UiButton>
              </template>
            </UiDropdown>
          </div>
          <input
            type="checkbox"
            @change="() => handleTaskstate(task)"
            v-model="task.completed"
            :checked="task.completed"
            class="checkbox z-[10] checkbox-primary"
          />
          <div class="title-desc">
            <span class="block text-sm">{{ task.title }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <UiModal @close="useQueryRoute('remove', 'task_modal_open')" id="add_task">
    <template #title> Add task </template>
    <template #default>
      <FormKit
        id="task-form"
        @submit="submitHandler"
        type="form"
        :submit-attrs="{
          inputClass: 'btn btn-success',
        }"
        submit-label="Add task"
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

const taskContainer = ref(null)
const formData = ref(null)
const pageOffset = ref(0)
const pageLimit = ref(20)
const toast = useToast()
const router = useRouter()
const { currentRoute } = router

const { data, pending, error } = useFetch('/api/tasks/getTasks', {
  key: 'tasksPage',
  params: {
    limit: pageLimit.value,
    offset: pageOffset.value,
    orderBy: '',
  },
})

const fetchMoreTasks = async () => {
  pageOffset.value += pageLimit.value
  const res = await $fetch('/api/tasks/getTasks', {
    params: {
      limit: pageLimit.value,
      offset: pageOffset.value,
    },
  })

  data.value = data.value.concat(res)
}

const handleDelete = (task) => {
  $fetch('/api/tasks/deleteTask', {
    method: 'POST',
    body: JSON.stringify({
      id: task.id,
    }),
    onResponse({ response }) {
      if (response.status !== 200) return
      data.value.tasks = data.value.tasks.filter((f) => f.id !== task.id)
      toast.add({
        severity: 'success',
        summary: 'Done',
        detail: 'Task deleted',
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

const handleEdit = (task) => {
  console.log('edit', task)
}

const actions = [
  {
    name: 'Delete',
  },
]

const handleAction = (element, task) => {
  switch (true) {
    case element.name === 'Edit':
      handleEdit(task)
      break
    case element.name === 'Delete':
      handleDelete(task)
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

const handleTaskstate = (task) => {
  const newTask = { ...task }
  $fetch('/api/tasks/updateTasks', {
    method: 'POST',
    body: JSON.stringify(newTask),
    onResponseError({ response }) {},
    onResponse({ response }) {
      if (response.status !== 200) return
    },
  })
}

onMounted(async () => {
  if (!!currentRoute.value.query.task_modal_open) {
    add_task.showModal()
    await nextTick()
    useFocus('title-input')
  }
})

const submitHandler = (formData) => {
  const res = new Promise((resolve, reject) => {
    $fetch('/api/tasks/createTask', {
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
        add_task.close()
        toast.add({
          severity: 'success',
          summary: 'Task created',
          detail: 'Your task was created successfully',
          group: 'br',
          life: 5000,
        })
        resolve(response)
        data.value.tasks = [response._data.tasks[0], ...data.value.tasks]
        refreshNuxtData('dailyTasks')
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
  add_task.showModal()
  useQueryRoute('add', 'task_modal_open', 'true')
  useFocus('title-input')
}

const closeModal = () => {
  add_task.close()
  reset('task-form')
}
</script>
