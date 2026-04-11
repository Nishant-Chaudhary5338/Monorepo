/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      addUtilities({
        ".bg-responsive": {
          backgroundImage: "url('/mobile/small-bg.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          [`@media (min-width: ${theme("screens.lg")})`]: {
            backgroundImage: "url('/desktop/bg-desktop.jpg')",
          },
        },
      });
    },
  ],
};
