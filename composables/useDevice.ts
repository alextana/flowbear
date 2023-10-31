import { ref } from 'vue'

export const useDevice = () => {
  const isMobile = ref(false)

  if (!process.client) return
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 1440
  })

  return isMobile
}
