// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindTypography from '@tailwindcss/typography'

export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
  },
  css: ['~/assets/css/main.css'],
  tailwindcss: {
    config: {
      plugins: [tailwindTypography],
    },
  },
  supabase: {
    redirect: false,
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@sidebase/nuxt-auth',
    'nuxt-icon',
    '@vueuse/nuxt',
    '@nuxtjs/supabase',
  ],
})
