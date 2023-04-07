const plugin = require("@tailwindcss/forms/src");

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
      "night",
      // {
      //   mytheme: {
      //     primary: "#38BDF8",

      //     secondary: "#818CF8",

      //     accent: "#F471B5",

      //     neutral: "#1E293B",

      //     "base-100": "#0F172A",

      //     info: "#0CA5E9",

      //     success: "#2DD4BF",

      //     warning: "#F4BF50",

      //     error: "#FB7085",
      //   },
      // },
    ],
  },
  plugins: [
    function ({ addVariant }) {
      addVariant(
        "supports-backdrop-blur",
        "@supports (backdrop-filter: blur(0)) or (-webkit-backdrop-filter: blur(0))"
      );
      addVariant(
        "supports-scrollbars",
        "@supports selector(::-webkit-scrollbar)"
      );
      addVariant("children", "& > *");
      addVariant("scrollbar", "&::-webkit-scrollbar");
      addVariant("scrollbar-track", "&::-webkit-scrollbar-track");
      addVariant("scrollbar-thumb", "&::-webkit-scrollbar-thumb");
    },
    require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
    require("daisyui"),
    require("tailwind-scrollbar")({ nocompatible: true }),
  ],
};
