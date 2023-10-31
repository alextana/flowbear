export const useSelectedDate = defineStore('selectedDate', () => {
  const currentDate = ref(new Date().toISOString())

  const isSelectedToday = () => {
    const today = new Date()
    const current = new Date(currentDate.value)
    today.setHours(0, 0, 0, 0)
    current.setHours(0, 0, 0, 0)

    return today.toISOString() === current.toISOString()
  }

  const changeCurrentDate = (newDate: string) => {
    return (currentDate.value = newDate)
  }

  return { currentDate, changeCurrentDate, isSelectedToday }
})
