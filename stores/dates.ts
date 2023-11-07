export const useSelectedDate = defineStore('selectedDate', () => {
  const currentDate: Ref<string | string[]> = ref(new Date().toISOString())

  const isSelectedToday = () => {
    if (Array.isArray(currentDate.value)) return false

    const today = new Date()
    const current = new Date(currentDate.value)
    today.setHours(0, 0, 0, 0)
    current.setHours(0, 0, 0, 0)

    return today.toISOString() === current.toISOString()
  }

  const changeCurrentDate = (newDate: string | string[]) => {
    return (currentDate.value = newDate)
  }

  return { currentDate, changeCurrentDate, isSelectedToday }
})
