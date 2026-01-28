/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "neutral-700": "#4A4A6A",
        "orange-1": "#FF7B2C",
        "neutral-150": "#EAEAEF",
        "yellow-1": "#FFB01D",
        "neutral-800": "#32324D",
      },
      fontFamily: {
        "mulish-regular": ["Mulish-Regular"],
        "mulish-medium": ["Mulish-Medium"],
        "mulish-bold": ["Mulish-Bold"],
        "dm-regular": ["DMSans-Medium"],
        "dm-bold": ["DMSans-Bold"],
      },
    },
  },
  darkMode: "class",
  plugins: [],
};