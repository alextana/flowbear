// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindTypography from '@tailwindcss/typography'

export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_ORIGIN: process.env.AUTH_ORIGIN,
    NUXT_SECRET: process.env.NUXT_SECRET,
    OPEN_AI_KEY: process.env.OPEN_AI_KEY,
  },
  build: {
    transpile: ['primevue'],
  },
  alias: {
    '@helpers': '/<rootDir>/helpers',
  },
  css: [
    '~/assets/css/main.css',
    'primevue/resources/themes/lara-light-blue/theme.css',
  ],
  tailwindcss: {
    config: {
      plugins: [tailwindTypography],
    },
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@formkit/nuxt',
    '@sidebase/nuxt-auth',
    'nuxt-icon',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@formkit/auto-animate/nuxt',
  ],
})
