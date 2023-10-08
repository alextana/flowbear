/** @type {import('tailwindcss').Config} */
export default {
  daisyui: {
    themes: [
      "synthwave",
      "dark",
      "cupcake",
    ],
  },
  theme: {
    extend: {},
  },
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  plugins: [require("daisyui")],
}

