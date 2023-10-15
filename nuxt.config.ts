// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindTypography from '@tailwindcss/typography'

export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
  },
  css: ['~/assets/css/main.css'],
  tailwindcss: {
    config: {
      plugins: [tailwindTypography],
    },
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@sidebase/nuxt-auth',
    'nuxt-icon',
    '@vueuse/nuxt',
  ],
})
