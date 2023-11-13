<template>
  <div class="container mx-auto">
    <WidgetsAddActivity />
    <UiSeparator class="my-8" />
    <WidgetsActivityRepeater :date="true" queryKey="dailyActivities" />
    <UiSeparator class="my-8" />
  </div>
</template>
