<template>
  <nav class="min-w-[200px]">
    <div class="py-2" v-for="entry in menuEntries">
      <component v-if="entry.component" :is="entry.component" />
      <NuxtLink :to="entry.link" v-else>
        <div :class="`flex gap-2 items-center ${shouldHighlight(entry)}`">
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
const route = useRoute()

const search = resolveComponent('UiSearch')
const menuEntries = [
  {
    id: 0,
    name: 'Search',
    component: search,
  },
  {
    id: 2,
    name: 'Goals',
    icon: 'octicon:goal-16',
    link: '/goals',
  },
]

const shouldHighlight = (entry) => {
  if (route.path.indexOf(entry.link) > -1) {
    return 'font-bold text-primary'
  }
}
</script>
