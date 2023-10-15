<template>
  <div class="dropdown">
    <label tabindex="0" class="btn btn-circle btn-xs btn-outline m-1">
      <Icon name="material-symbols:add" size="18" />
    </label>
    <ul
      tabindex="0"
      class="dropdown-content z-[1] menu bg-base-300 p-2 shadow rounded-box w-52"
    >
      <template v-if="data" v-for="goal in data">
        <li @click="handleAddGoal(goal)">
          <a class="no-underline">
            {{ goal.title }}
          </a>
        </li>
      </template>
    </ul>
  </div>

  <div
    v-if="hasGoals()"
    class="ml-2 goals-display flex items-center gap-2 text-neutral-content"
  >
    <template v-for="goal in getGoals()">
      <div class="w-max px-2 py-1 bg-neutral rounded-full text-xs">
        <div v-if="goal?.title" class="flex gap-1 items-center">
          <span class="block">{{ goal.title }}</span>
          <Icon
            class="cursor-pointer"
            @click="handleRemoveGoal(goal)"
            name="mdi:remove"
            size="16"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { onClickOutside } from '@vueuse/core'
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

const getGoals = () => {
  if (!props.goals) return []

  if (!Array.isArray(props.goals)) {
    return [props.goals]
  }

  return props.goals
}

const hasGoals = () => {
  if (!props.goals) return false

  if (Array.isArray(props.goals)) {
    if (!props.goals.length) return false
  }

  if (!Object.values(props.goals)[0]) {
    return false
  }

  return true
}

const handleRemoveGoal = (goal) => {
  $fetch('/api/goals/removeGoal', {
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

const handleAddGoal = (goal) => {
  $fetch('/api/goals/addGoal', {
    method: 'POST',
    body: JSON.stringify({
      goalId: goal.goalId,
      activityId: props.activity.id,
    }),
    onResponse() {
      refreshNuxtData('activities')
      // toggles dropdown
      document.activeElement.blur()
    },
  })
}
</script>
