<template>
  <nav>
    <div class="py-2" v-for="entry in menuEntries">
      <component v-if="entry.component" :is="entry.component" />
      <NuxtLink :to="entry.link" v-else>
        <div class="flex gap-2 items-center">
          <Icon :name="entry.icon" size="20" />
          <span class="block">
            {{ entry.name }}
          </span>
        </div>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup>
const search = resolveComponent('UiSearch')
const menuEntries = [
  {
    id: 0,
    name: 'Search',
    component: search,
  },
  // {
  //   id: 1,
  //   name: 'Milestones',
  //   icon: 'octicon:milestone-16',
  //   link: '/milestones',
  // },
  {
    id: 2,
    name: 'Goals',
    icon: 'octicon:goal-16',
    link: '/goals',
  },
]
</script>
