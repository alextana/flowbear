<template>
  <div class="button-container relative">
    <button
      class="bg-neutral-900 rounded-full m-0 p-0 w-6 h-6 hover:bg-purple-800 grid place-content-center"
      @click="toggleDropdown"
    >
      <Icon name="material-symbols:add" size="18" />
    </button>
    <div
      ref="target"
      v-if="showDropdown"
      class="dropdown min-w-max max-w-[250px] absolute bottom-0 bg-black rounded-2xl p-4"
    >
      <template v-if="data" v-for="goal in data">
        <div
          @click="handleAddGoal(goal)"
          class="goal w-full hover:bg-neutral-900 px-3 cursor-pointer"
        >
          {{ goal.title }}
        </div>
      </template>
    </div>
  </div>
  <div v-if="goals" class="ml-2 goals-display flex items-center gap-2">
    <template v-for="goal in getGoals()">
      <div class="w-max px-2 py-1 bg-black rounded-full text-xs">
        {{ goal.title }}
      </div>
    </template>
  </div>
</template>

<script setup>
import { onClickOutside } from '@vueuse/core'
const target = ref(null)
const showDropdown = ref(false)
const props = defineProps({
  activity: {
    type: Object,
    default: {},
  },
  goals: {
    type: Object,
    default: null,
  },
})

const { data, pending, error } = useFetch('/api/goals/getGoals', {
  key: 'goals',
})

onClickOutside(target, () => (showDropdown.value = false))

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const getGoals = () => {
  if (!props.goals) return []

  if (!Array.isArray(props.goals)) {
    return [props.goals]
  }

  return props.goals
}

const handleAddGoal = (goal) => {
  $fetch('/api/goals/addGoal', {
    method: 'POST',
    body: JSON.stringify({
      goalId: goal.goalId,
      activityId: props.activity.id,
    }),
    onResponse() {
      refreshNuxtData('activities')
    },
  })
}
</script>
