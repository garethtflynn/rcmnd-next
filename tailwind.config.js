/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        pulseGrow: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
        },
      },
      animation: {
        "pulse-grow": "pulseGrow 1.2s ease-in-out infinite",
      },
      //newColors: {
      // black: #000000
      // darkGrey: #252220
      // offWhite: #F1E9DA
      // white: "#FBF8F4",
      // }
    },
  },
  plugins: [],
};
