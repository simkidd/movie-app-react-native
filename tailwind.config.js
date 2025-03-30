/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#0f0f0f",
        // primary: "#0F172A",
        secondary: "#1E293B",
        accent: "#ff194c",
        "accent-light": "#ff9a91",
        // accent: "#F59E0B",
        text: {
          primary: "#F8FAFC",
          secondary: "#94A3B8",
          accent: "#F59E0B",
        },
      },
    },
  },
  plugins: [],
};
