export const useSelectedDate = defineStore('selectedDate', () => {
  const currentDate = ref(new Date().toISOString())

  const changeCurrentDate = (newDate: string) => {
    return (currentDate.value = newDate)
  }

  return { currentDate, changeCurrentDate }
})
