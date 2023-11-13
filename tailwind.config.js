/** @type {import('tailwindcss').Config} */
export default {
  daisyui: {
    themes: [
      "light",
      "night",
    ],
    darkTheme: 'night'
  },
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}

