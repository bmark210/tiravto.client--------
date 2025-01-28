/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,svg}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          md: "4rem",
          lg: "6rem",
          xl: "7rem",
          // "2xl": "10rem",
        },
      },
      screens: {
        "2xl": "1440px",
        "3xl": "1920px",
      },
    },
  },
  plugins: [],
};
