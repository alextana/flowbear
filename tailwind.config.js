/** @type {import('tailwindcss').Config} */
export default {
  daisyui: {
    themes: [
      "light",
      "dark",
    ],
  },
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}

