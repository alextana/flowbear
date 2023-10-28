<template>
  <div class="container mx-auto">
    <WidgetsAddActivity />
    <UiSeparator class="my-8" />
    <WidgetsActivityRepeater
      :date="new Date().toISOString()"
      queryKey="dailyActivities"
    />
    <UiSeparator class="my-8" />
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <WidgetsDailyActivities
        class="col-span-1 shadow shadow-primary-content dark:shadow-base-200"
      />
      <WidgetsStats
        class="col-span-3 shadow shadow-primary-content dark:shadow-base-200"
      />
    </div>
    <!-- <WidgetsActivityRepeater /> -->
  </div>
</template>
