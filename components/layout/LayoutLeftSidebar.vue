<template>
  <nav class="min-w-[200px]">
    <ul class="py-2">
      <template v-for="entry in menuEntries">
        <li
          :class="`hover:bg-base-200 hover:text-base-content px-4 py-4 mb-2 rounded-2xl ${shouldHighlight(
            entry
          )}`"
        >
          <component v-if="entry.component" :is="entry.component" />

          <NuxtLink :to="entry.link" v-else>
            <a class="flex gap-2 items-center">
              <Icon :name="entry.icon" size="20" />
              <span class="block">
                {{ entry.name }}
              </span>
            </a>
          </NuxtLink>
        </li>
      </template>
    </ul>
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
    id: 1,
    name: 'Activities',
    icon: 'lucide:text',
    link: '/activities',
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
    return 'font-bold bg-primary text-primary-content hover:bg-primary-focus hover:text-primary-content focus:ring focus:ring-violet-300'
  }
}
</script>
