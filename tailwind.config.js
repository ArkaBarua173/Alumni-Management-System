/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#7536b5",

          secondary: "#ffa3c3",

          accent: "#d1c330",

          neutral: "#322833",

          "base-100": "#EFF1F5",

          info: "#45B9D3",

          success: "#3ED0BA",

          warning: "#F1D546",

          error: "#E92B2B",
        },
      },
    ],
  },
  plugins: [require("@tailwindcss/forms"), require("daisyui")],
};
