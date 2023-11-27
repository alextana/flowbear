/** @type {import('tailwindcss').Config} */
export default {
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "light",
      "night",
      {
        darkBlue: {
          "primary": "#8280F6",
          "secondary": "#4CA6EC",
          "accent": "#D34FEA",
          "neutral": "#252b37",
          "base-100": "#292f3d",
          "info": "#354AFF",
          "success": "#4CA986",
          "warning": "#FEBE01",
          "error": "#FF5861",
        },
      }
    ],
    darkTheme: 'darkBlue'
  },
  theme: {
    extend: {},
  },
}

