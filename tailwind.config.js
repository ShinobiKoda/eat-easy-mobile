/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "neutral-700": "var(--neutral-700)",
        "orange-1": "var(--orange-1)",
      },
      fontFamily: {
        "mulish-regular": ["Mulish-Regular"],
        "mulish-medium": ["Mulish-Medium"],
        "mulish-bold": ["Mulish-Bold"],
        "mulish-regular": ["Mulish-Regular"],
        "dm-regular": ["DMSans-Medium"],
        "dm-bold": ["DMSans-Bold"],
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
