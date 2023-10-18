<template>
  <div class="container mx-auto">
    <WidgetsAddActivity />
    <UiSeparator class="my-8" />
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <WidgetsDailyActivities
        class="col-span-1 shadow shadow-primary-content"
      />
      <WidgetsStats class="col-span-3 shadow shadow-primary-content" />
    </div>
    <!-- <WidgetsActivityRepeater /> -->
  </div>
</template>
