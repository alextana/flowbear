<template>
  <LayoutHeader />
  <div class="content-layout flex items-start w-full px-4">
    <LayoutSidebar class="w-[18rem]" />
    <LayoutMainContent class="flex-1">
      <slot />
    </LayoutMainContent>
  </div>
</template>

<script setup>
onBeforeMount(() => {
  if (!process.client) {
    return
  }

  localStorage.setItem('locale', navigator.language)
})
</script>
