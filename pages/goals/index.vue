<template>
  <div class="goals container mx-auto">
    <div v-if="pending" class="grid place-content-center">
      <span class="loading loading-ring loading-md"></span>
    </div>
    <div v-if="error">error...</div>
    <div v-if="data">
      <div v-if="!data.length">
        <p>You haven't created any goals</p>
        <UiSeparator class="my-4" />
        <UiButton kind="primary" @click="handleCreate">Create goal</UiButton>
      </div>

      <div v-else>
        <UiButton kind="primary" @click="handleCreate">Create goal</UiButton>
        <UiSeparator class="my-8" />
        <div
          class="goals h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 items-stretch gap-4"
        >
          <div class="goal h-full" v-for="goal in data">
            <div class="card w-full h-full bg-base-100 border border-base-300">
              <div class="card-body">
                <h2 class="card-title">{{ goal.title }}</h2>
                <p>{{ goal.description }}</p>
                <div class="card-actions justify-end">
                  <NuxtLink :to="`/goals/${goal.goalId}?name=${goal.title}`">
                    <UiButton kind="primary" size="sm">View</UiButton>
                  </NuxtLink>
                </div>
              </div>
            </div>
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
