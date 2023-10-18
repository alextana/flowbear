<template>
  <div class="w-full min-w-[71ch]">
    <h1 class="text-4xl tracking-tight font-bold text-content">
      Hey
      <span v-if="data?.user?.name">{{ data.user.name.split(' ')[0] }}</span>
    </h1>
    <p class="text-neutral/50 text-lg">what have you been up to?</p>
    <UiSeparator class="my-4" />
    <InputTipTap
      v-model="activityContent"
      classProps="mt-8 rounded-2xl bg-base-100 min-h-[125px] border-2 border-base-300 prose prose-slate w-full min-w-full mx-auto prose-base"
    />
    <UiSeparator class="mb-4" />

    <div class="flex actions justify-end gap-2">
      <div class="dropdown">
        <label v-if="!goalPreview" tabindex="0" class="btn btn-outline">
          <Icon name="material-symbols:add" size="18" /> Add goal
        </label>
        <label v-else tabindex="0" class="btn btn-success">
          <Icon name="iconamoon:edit" size="18" /> {{ goalPreview.title }}
        </label>
        <ul
          tabindex="0"
          class="dropdown-content z-[1] mt-4 menu border border-base-300 bg-base-100 p-2 shadow-xl rounded-box w-52"
        >
          <li class="text-xs border-b p-2 mb-2 font-semibold">Select a goal</li>
          <template v-if="goalsData?.length" v-for="goal in goalsData">
            <li @click="handleGoal(goal)">
              <a class="no-underline">
                {{ goal.title }}
              </a>
            </li>
          </template>
          <template v-if="goalPreview">
            <li @click="removeGoal"><a class="no-underline">No goal</a></li>
          </template>
          <template v-else-if="!goalPreview && !goalsData?.length">
            <NuxtLink to="/goals"
              ><li><a>Create goal</a></li></NuxtLink
            >
          </template>
        </ul>
      </div>

      <UiButton @click="handleAdd" kind="primary">Add activity</UiButton>
    </div>
  </div>
  <Toast position="bottom-right" group="br" />
</template>

<script setup>
const { data } = useAuth()
const goalPreview = ref(null)
const activityContent = ref('')
import { useToast } from 'primevue/usetoast'
const toast = useToast()

const handleAdd = () => {
  $fetch('/api/activities/createActivity', {
    body: {
      content: activityContent.value,
      goalId: goalPreview?.value?.goalId,
    },
    method: 'PUT',
    onResponse() {
      activityContent.value = ''
      refreshNuxtData('activities')
      goalPreview.value = null
      toast.add({
        severity: 'success',
        summary: 'Done',
        detail: 'Activity added',
        group: 'br',
        life: 3000,
      })
    },
  })
}

const {
  data: goalsData,
  pending,
  error,
} = useFetch('/api/goals/getGoals', {
  key: 'goals',
})

const handleGoal = (goal) => {
  goalPreview.value = goal
  document.activeElement.blur()
}

const removeGoal = () => {
  goalPreview.value = null
  document.activeElement.blur()
}
</script>
