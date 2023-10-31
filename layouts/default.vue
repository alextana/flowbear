<template>
  <!-- handle mobile later, have different layouts -->
  <LayoutHeader />
  <UiSeparator class="mb-4" />
  <div class="content-layout font-poppins flex items-start w-full">
    <LayoutLeftSidebar class="w-[18rem] px-4" />
    <LayoutMainContent class="flex-1">
      <slot />
    </LayoutMainContent>
    <LayoutRightSidebar class="min-w-[450px] max-w-[450px]" />
  </div>
</template>
