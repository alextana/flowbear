<template>
  <nav class="min-w-[288px] sticky top-5">
    <ul class="py-2">
      <template v-for="activity in menuActivities">
        <button
          :class="`transition-all w-full hover:bg-base-200 hover:text-base-content
          px-4 py-4 mb-2 rounded-2xl ${shouldHighlight(activity)}`"
        >
          <NuxtLink :to="activity.link">
            <div class="flex gap-2 items-center">
              <Icon :name="activity.icon" size="20" />
              <span class="block">
                {{ activity.name }}
              </span>
            </div>
          </NuxtLink>
        </button>
      </template>
    </ul>
  </nav>
</template>

<script setup>
const route = useRoute()

const menuActivities = [
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

const shouldHighlight = (activity) => {
  if (activity.link === '/') {
    if (route.path === activity.link) {
      return 'font-bold bg-primary text-primary-content hover:bg-primary-focus hover:text-primary-content focus:ring focus:ring-violet-300'
    } else {
      return
    }
  }

  if (route.path.indexOf(activity.link) > -1) {
    return 'font-bold bg-primary text-primary-content hover:bg-primary-focus hover:text-primary-content focus:ring focus:ring-violet-300'
  }
}
</script>
