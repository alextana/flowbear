<template>
  <div class="goals container mx-auto">
    <div class="heading flex justify-between">
      <h1 class="text-4xl font-extrabold">Goals</h1>
      <UiButton kind="primary" @click="handleCreate">Create goal</UiButton>
    </div>
    <UiSeparator class="mb-4" />

    <div v-if="pending && !data" class="grid place-content-center">
      <span class="loading loading-dots loading-lg"></span>
    </div>
    <div v-if="error">error...</div>
    <div v-if="data">
      <div v-if="!data.length">
        <p>You haven't created any goals</p>
        <UiSeparator class="my-4" />
      </div>
      <div v-else>
        <UiSeparator class="my-8" />
        <div
          class="goals h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 items-stretch gap-4"
        >
          <div class="goal h-full" v-for="goal in data">
            <NuxtLink :to="`/goals/${goal.goalId}?name=${goal.title}`">
              <button
                class="card text-left min-h-[180px] min-w-[180px] w-full bg-base-100 dark:hover:bg-neutral/50 dark:hover:text-neutral-content hover:bg-primary hover:text-primary-content border border-base-300"
              >
                <div class="card-body w-full">
                  <h2 class="card-title">{{ goal.title }}</h2>
                  <div class="counts w-full flex gap-2 justify-between">
                    <div
                      class="todos-count w-full text-center border border-neutral p-3 rounded-xl"
                    >
                      <span class="uppercase text-xs font-bold block"
                        >todos</span
                      >
                      <span class="font-bold text-xl"
                        >{{ goal.completed_todos }}
                        /
                        {{ goal.total_todos }}
                      </span>
                    </div>
                    <div
                      class="activities-count w-full text-center border border-neutral p-3 rounded-xl"
                    >
                      <span class="uppercase text-xs font-bold block"
                        >activities</span
                      >
                      <span class="font-bold text-xl">
                        {{ goal.total_activities }}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <UiModal id="goal_modal">
      <template #title>
        <div>Create goal</div>
      </template>
      <template #default>
        <div>
          <UiInputText label="Goal title" v-model="goal.title" />
          <UiSeparator class="my-4" />
          <UiInputText label="Goal description" v-model="goal.description" />
        </div>
      </template>

      <template #buttons>
        <div class="w-full justify-end flex gap-2">
          <button @click="handleCancel" class="btn btn-sm btn-ghost">
            cancel
          </button>
          <button class="btn btn-sm btn-success" @click="createGoal">
            Create Goal
          </button>
        </div>
      </template>
    </UiModal>
  </div>
</template>

<script setup>
const { data, pending, error } = useFetch('/api/goals/getGoals', {
  key: 'goals',
})

const goal = ref({
  title: '',
  description: '',
  content: '',
})

const handleCreate = () => {
  goal_modal.showModal()
}

const resetData = () => {
  goal.value = {
    title: '',
    description: '',
    content: '',
  }
}

const handleCancel = () => {
  goal_modal.close()
  resetData()
}

const createGoal = () => {
  $fetch('/api/goals/createGoal', {
    method: 'POST',
    body: JSON.stringify(goal.value),
    onResponse() {
      refreshNuxtData('goals')
      goal_modal.close()
      resetData()
    },
  })
}
</script>
