<template>
  <nav class="min-w-[200px] sticky top-5">
    <ul class="py-2">
      <template v-for="entry in menuEntries">
        <li
          :class="`transition-all hover:bg-base-200 hover:text-base-content
          px-4 py-4 mb-2 rounded-2xl ${shouldHighlight(entry)}`"
        >
          <NuxtLink :to="entry.link">
            <span class="flex gap-2 items-center">
              <Icon :name="entry.icon" size="20" />
              <span class="block">
                {{ entry.name }}
              </span>
            </span>
          </NuxtLink>
        </li>
      </template>
    </ul>
  </nav>
</template>

<script setup>
const route = useRoute()

const menuEntries = [
  {
    id: 0,
    name: 'Home',
    icon: 'iconamoon:home-bold',
    link: '/',
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
  {
    id: 3,
    name: 'Todos',
    icon: 'lucide:list-todo',
  },
]

const shouldHighlight = (entry) => {
  if (entry.link === '/') {
    if (route.path === entry.link) {
      return 'font-bold bg-primary text-primary-content hover:bg-primary-focus hover:text-primary-content focus:ring focus:ring-violet-300'
    } else {
      return
    }
  }

  if (route.path.indexOf(entry.link) > -1) {
    return 'font-bold bg-primary text-primary-content hover:bg-primary-focus hover:text-primary-content focus:ring focus:ring-violet-300'
  }
}
</script>
