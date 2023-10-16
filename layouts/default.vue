<template>
  <LayoutHeader />
  <div class="content-layout flex items-start w-full">
    <LayoutSidebar class="w-[18rem] px-4" />
    <LayoutMainContent class="flex-1 px-4">
      <slot />
    </LayoutMainContent>
  </div>
</template>
